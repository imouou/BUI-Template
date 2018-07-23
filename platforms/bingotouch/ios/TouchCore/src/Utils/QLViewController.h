//
//  QLViewController.h
//  OpenOffice
//
//  Created by willonboy zhang on 12-8-6.
//  Copyright (c) 2012年 willonboy.tk. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <QuickLook/QuickLook.h>


@protocol QLViewControllerDelegate <NSObject>

- (void)choiceCFStringEncoding:(QLPreviewController *)controller stringEncoding:(CFStringEncodings) encoding;

@end


@interface QLViewController : QLPreviewController< UIActionSheetDelegate,QLPreviewControllerDataSource,
QLPreviewControllerDelegate, QLViewControllerDelegate>
{
    NSStringEncoding    _stringEncoding;
}

@property (nonatomic, weak) id<QLViewControllerDelegate> qlViewControllerDelegate;
@property (nonatomic, assign) BOOL isTextFile;
@property (nonatomic, strong) NSURL *qlFileUrl;


@end
