#import "FilePlugin.h"

@implementation FilePlugin

#define FILE_NOT_FOUND @"Can not find the file."

//获得图片的信息:imageUri
//返回：{size:xxx,width:xxx,height:xxx}
-(void)getImageInfo:(CDVInvokedUrlCommand *)command{
    CDVPluginResult* pluginResult=nil;
    NSString* imagePath=[command.arguments objectAtIndex:0];
    NSData* imageData=[NSData dataWithContentsOfURL:[NSURL URLWithString:imagePath]];
    if(imageData!=nil){
        UIImage *image=[UIImage imageWithData:imageData];
        NSDictionary* result=[[NSDictionary alloc] initWithObjectsAndKeys:
                              [NSString stringWithFormat:@"%lu",(unsigned long)imageData.length],@"size",
                              [NSString stringWithFormat:@"%0.0f",image.size.width],@"width",
                              [NSString stringWithFormat:@"%0.0f",image.size.height],@"height", nil];
        pluginResult=[CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:[result JSONString]];
    }else {
        pluginResult=[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Can not find the image."];
    }
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}


//压缩图片:{source:'xxx',savePath:'xxx',isSaved:true/false,width:222,height:545,returnType:'base64/uri'}
//返回字符串，压缩后的地址或者base64字符串
-(void)imageCompress:(CDVInvokedUrlCommand *)command{
    
    [self.commandDelegate runInBackground:^{
        
        CDVPluginResult* pluginResult=nil;
        NSDictionary* opts=[command.arguments objectAtIndex:0];
        NSString* source=[opts objectForKey:@"source"];
        NSString* savePath=[opts objectForKey:@"savePath"];
        BOOL isSaved=[[opts objectForKey:@"isSaved"] boolValue];
        NSString* returnType=[opts objectForKey:@"returnType"];
        long width=[[opts objectForKey:@"width"] integerValue];
        long height=[[opts objectForKey:@"height"] integerValue];
        
        //把图片转成nsdata
        NSData * imageData=[NSData dataWithContentsOfURL:[NSURL URLWithString:source]];
        
        if(imageData!=nil){
            UIImage* targetImage=[UIImage imageWithData:imageData];
            //压缩图片
            NSData*  compressData;
            //如果长宽都不等于0再考虑计算比率压缩
            if(width!=0&&height!=0){
                if(width>height){
                    compressData=UIImageJPEGRepresentation(targetImage,height/width);
                }else{
                    compressData=UIImageJPEGRepresentation(targetImage,width/height);
                }
            }else{
                //这里系数比较奇怪
                compressData=UIImageJPEGRepresentation(targetImage,0.75/4);
            }
            
            //如果要存储，就存在指定的文件下面
            if(isSaved){
                [compressData writeToFile:savePath atomically:true];
            }
            //判断返回的信息
//            if([returnType isEqual:@"base64"]){
//                NSString* base64Str=[GTMBase64 stringByEncodingData:compressData];
//                NSLog(@"BASE64:%@",base64Str);
//                pluginResult=[CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:base64Str];
//            }else if([returnType isEqual:@"uri"]){
//                
//            }
            NSLog(@"图片路径:%@",savePath);
            pluginResult=[CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:savePath];
        }else{
            pluginResult=[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Can not find the image."];
        }
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
    
}

//改变尺寸
-(UIImage *) imageCompressForSize:(UIImage *)sourceImage targetSize:(CGSize)size{
    UIImage *newImage = nil;
    CGSize imageSize = sourceImage.size;
    CGFloat width = imageSize.width;
    CGFloat height = imageSize.height;
    CGFloat targetWidth = size.width;
    CGFloat targetHeight = size.height;
    CGFloat scaleFactor = 0.0;
    CGFloat scaledWidth = targetWidth;
    CGFloat scaledHeight = targetHeight;
    CGPoint thumbnailPoint = CGPointMake(0.0, 0.0);
    if(CGSizeEqualToSize(imageSize, size) == NO){
        CGFloat widthFactor = targetWidth / width;
        CGFloat heightFactor = targetHeight / height;
        if(widthFactor > heightFactor){
            scaleFactor = widthFactor;
        }
        else{
            scaleFactor = heightFactor;
        }
        scaledWidth = width * scaleFactor;
        scaledHeight = height * scaleFactor;
        if(widthFactor > heightFactor){
            thumbnailPoint.y = (targetHeight - scaledHeight) * 0.5;
        }else if(widthFactor < heightFactor){
            thumbnailPoint.x = (targetWidth - scaledWidth) * 0.5;
        }
    }
    
    UIGraphicsBeginImageContext(size);
    
    CGRect thumbnailRect = CGRectZero;
    thumbnailRect.origin = thumbnailPoint;
    thumbnailRect.size.width = scaledWidth;
    thumbnailRect.size.height = scaledHeight;
    [sourceImage drawInRect:thumbnailRect];
    newImage = UIGraphicsGetImageFromCurrentImageContext();
    
    if(newImage == nil){
        NSLog(@"scale image fail");
    }
    
    UIGraphicsEndImageContext();
    
    return newImage;
    
}

//读取文件内容，utf8格式
-(void)readAsString:(CDVInvokedUrlCommand *)command{
    
    [self.commandDelegate runInBackground:^{
        CDVPluginResult* pluginResult=nil;
        NSString * uri=[command.arguments objectAtIndex:0];
        
        // 要检查的文件目录
        NSString * filePath = uri;
        NSFileManager *fileManager = [NSFileManager defaultManager];
        NSString * content=nil;
        if ([fileManager fileExistsAtPath:filePath]) {
            NSLog(@"文件存在:%@",filePath);
            content=[NSString stringWithContentsOfFile:uri encoding:NSUTF8StringEncoding error:nil];
            pluginResult=[CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:content];
        }
        else {
            NSLog(@"文件不存在:%@",filePath);
            pluginResult=[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:FILE_NOT_FOUND];
        }
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

//写入文件内容，文件不存在则创建
-(void)writeAsString:(CDVInvokedUrlCommand *)command{
    
    [self.commandDelegate runInBackground:^{
        CDVPluginResult* pluginResult=nil;
        NSString * uri=[command.arguments objectAtIndex:0];
        NSMutableString * content=[command.arguments objectAtIndex:1];
        
        // 要检查的文件目录
        NSString * filePath = uri;
        NSFileManager *fileManager = [NSFileManager defaultManager];
        NSLog(@"文件内容:%@",content);
        if ([fileManager fileExistsAtPath:filePath]) {
            NSLog(@"文件存在:%@",filePath);
            [content writeToFile:filePath atomically:true encoding:NSUTF8StringEncoding error:nil];
        }else {
            NSLog(@"文件不存在,自动创建:%@",filePath);
            NSData * data=[content dataUsingEncoding:NSUTF8StringEncoding];
            [fileManager createFileAtPath:filePath contents:data attributes:nil];
        }
        pluginResult=[CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"ok"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
      
    }];
    
}

-(void)removeFile:(CDVInvokedUrlCommand *)command{
    CDVPluginResult* pluginResult=nil;
    NSString * uri=[command.arguments objectAtIndex:0];
    
    // 要检查的文件目录
    NSString * filePath = uri;
    NSFileManager *fileManager = [NSFileManager defaultManager];
    
    if ([fileManager fileExistsAtPath:filePath]) {
        NSLog(@"文件存在:%@",filePath);
        [fileManager removeItemAtPath:filePath error:nil];
        pluginResult=[CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"ok"];
    }
    else {
        NSLog(@"文件不存在:%@",filePath);
        pluginResult=[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:FILE_NOT_FOUND];
    }
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

@end
