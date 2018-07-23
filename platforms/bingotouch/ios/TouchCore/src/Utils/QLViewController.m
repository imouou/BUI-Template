//
//  QLViewController.m
//  OpenOffice
//
//  Created by willonboy zhang on 12-8-6.
//  Copyright (c) 2012年 willonboy.tk. All rights reserved.
//

#import "QLViewController.h"

@implementation QLViewController
@synthesize isTextFile;
@synthesize qlViewControllerDelegate;
@synthesize qlFileUrl;




#pragma mark - View lifecycle

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    if (qlFileUrl) 
    {
        if (!self.dataSource) 
        {
            self.dataSource = self;
        }
        
        if (!self.qlViewControllerDelegate) 
        {
            self.qlViewControllerDelegate = self;
        }
    }
}

    //添加个转码按钮
- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:YES];
    
        //只针对txt文件或文本类文件才启用转码
    if (!self.isTextFile)
    {
        return;
    }  
    
    UIButton *btn = [UIButton buttonWithType:UIButtonTypeRoundedRect];
    [btn setTitle:@"编码" forState:UIControlStateNormal];
    [btn addTarget:self action:@selector(encodeingChangeClicked:) forControlEvents:UIControlEventTouchUpInside];
    
    for (UIView *v in self.view.subviews)
    {
        NSLog(@"subview %@", v);
            //针对iPad设备(不区分4.0+和5.0+)
        if (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPad) 
        {
            for (UIView *v2 in v.subviews)
            {
                NSLog(@"v.subview %@", v2);
                for (UIView *v3 in v2.subviews)
                {
                    NSLog(@"v2.subview %@", v3);   
                    for (UIView *v4 in v3.subviews)
                    {
                        NSLog(@"v3.subview %@", v4); 
                        if ([v4 isKindOfClass: [UINavigationBar class]])
                        {
                            for (UIView *v5 in v4.subviews)
                            {
                                NSLog(@"v4.subview %@", v5);               
                            }
                            
                            btn.frame = CGRectMake(650, 7, 43, 30);
                            [v4 addSubview:btn];
                        }
                    }
                }
            }
        }
            //针对iPone设备(区分4.0+和5.0+)
        else
        {
                //iphone iOS 5.0+
            if ([[UIDevice currentDevice].systemVersion floatValue] >= 5.0f) 
            {
                if ([v isKindOfClass: [UINavigationBar class]])
                {
                    for (UIView *v2 in v.subviews)
                    {
                        NSLog(@"v.subview %@", v2);               
                    }
                    
                    btn.frame = CGRectMake(200, 7, 43, 30);
                    [v addSubview:btn];   
                }
            }
                //iphone iOS 4.0+ < 5.0+
            else
            {
                for (UIView *v2 in v.subviews)
                {
                    NSLog(@"v.subview %@", v2);
                    if ([[UIDevice currentDevice].systemVersion floatValue] < 5.0f) 
                    {
                        if ([v2 isKindOfClass: [UINavigationBar class]])
                        {
                            for (UIView *v3 in v2.subviews)
                            {
                                NSLog(@"v2.subview %@", v3);               
                            }
                            
                            btn.frame = CGRectMake(200, 7, 43, 30);
                            [v2 addSubview:btn];  
                        }
                    }
                }
            }
        }
    }
}


- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation
{
    return (interfaceOrientation == UIInterfaceOrientationPortrait);
}


- (void)encodeingChangeClicked:(id) sender
{
    UIActionSheet *actionSheet = [[UIActionSheet alloc] initWithTitle:nil delegate:self cancelButtonTitle:@"取消" destructiveButtonTitle:nil 
                                                    otherButtonTitles: @"ASCII", @"UTF-8",@"UTF-16",@"UTF-16 BE", @"GB2312", @"GB18030_2000", nil];
    [actionSheet showInView:self.view];
}


- (void)actionSheet:(UIActionSheet *)actionSheet clickedButtonAtIndex:(NSInteger)buttonIndex;
{
    if (self.qlViewControllerDelegate && [self.qlViewControllerDelegate respondsToSelector:@selector(choiceCFStringEncoding:stringEncoding:)])
    {
        switch (buttonIndex)
        {
            case 0:
                [self.qlViewControllerDelegate choiceCFStringEncoding:self stringEncoding:kCFStringEncodingASCII];
                break;
            case 1:
                [self.qlViewControllerDelegate choiceCFStringEncoding:self stringEncoding:kCFStringEncodingUTF8];
                break;
            case 2:
                [self.qlViewControllerDelegate choiceCFStringEncoding:self stringEncoding:kCFStringEncodingUTF16];
                break;
            case 3:
                [self.qlViewControllerDelegate choiceCFStringEncoding:self stringEncoding:kCFStringEncodingUTF16BE];
                break;
            case 4:
                [self.qlViewControllerDelegate choiceCFStringEncoding:self stringEncoding:kCFStringEncodingGB_2312_80];
                break;
            case 5:
                [self.qlViewControllerDelegate choiceCFStringEncoding:self stringEncoding:kCFStringEncodingGB_18030_2000];
                break;                
            default:
                break;
        }
    }
    
}


#pragma mark -
#pragma mark - QLPreviewControllerDataSource

- (NSInteger)numberOfPreviewItemsInPreviewController:(QLPreviewController *)controller;
{
    return 1;
}

- (id <QLPreviewItem>)previewController:(QLPreviewController *)controller previewItemAtIndex:(NSInteger)index;
{
        //NSURL   *originalFileUrl    = [NSURL fileURLWithPath:[[NSBundle mainBundle] pathForResource:@"readme" ofType:@"txt"]];
    NSURL   *originalFileUrl = self.qlFileUrl;
    NSString    *fileExt        = [originalFileUrl pathExtension];
    
        //如果txt文件
    if (fileExt && [[fileExt lowercaseString] isEqualToString:@"txt"]) 
    {
        NSError *err        = nil;
        NSData  *fileData   = nil;
        NSFileManager *fm   = [NSFileManager defaultManager];
        NSString    *tmpFilePath    = [NSString stringWithFormat:@"%@/tmp/%@", NSHomeDirectory(), [originalFileUrl lastPathComponent]];
        NSURL       *tmpFileUrl     = [NSURL fileURLWithPath:tmpFilePath];
        NSString    *originalFilePath  = [originalFileUrl path];
        ((QLViewController *)controller).isTextFile = YES;
        NSStringEncoding encode;
        NSString *contentStr = nil;
        
        if (!_stringEncoding) 
        {
                //如果有文件副本则直接返回副本文件(因为可能已经正确转码过了)
            if([fm fileExistsAtPath:tmpFilePath]) 
            {
                return tmpFileUrl;
            }
                //下面方法获取指定文件的字符编码集  如果返回值为nil 那么err就会带回返回值, 可能的错误是文件系统错误或是字符编码错误
            contentStr = [NSString stringWithContentsOfFile:originalFilePath usedEncoding:&encode error:&err];
            NSLog(@"原文件编码:  %d", encode);
            NSLog(@"原文件内容:  %@", contentStr);
        }
        else
        {
            contentStr = [NSString stringWithContentsOfFile:originalFilePath encoding:_stringEncoding error:&err];
            
            if (contentStr) 
            {
                    //转码为UTF-16编码
                fileData = [contentStr dataUsingEncoding:NSUTF16StringEncoding];
                    //删除旧的副本文件
                if([fm fileExistsAtPath:tmpFilePath]) 
                {
                    [fm removeItemAtPath:tmpFilePath error:nil];
                }
                    //创建原文件副本
                [fileData writeToFile:tmpFilePath atomically:YES];
                    //txt文件返回原文件副本文件URL
                return tmpFileUrl;
            }
            else
            {
                return nil;
            }
        }
    }
        //非txt文件直接返回原文件URL
    return originalFileUrl;
}

- (void)choiceCFStringEncoding:(QLPreviewController *)controller stringEncoding:(CFStringEncodings) encoding;
{
    _stringEncoding = CFStringConvertEncodingToNSStringEncoding(encoding);
        //重新读取原文件副本文件(即tmp文件)
    [controller reloadData];
}


@end













