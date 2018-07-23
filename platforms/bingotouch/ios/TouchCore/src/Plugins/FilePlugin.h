#import "TouchPlugin.h"

@interface FilePlugin : TouchPlugin
-(void)getImageInfo:(CDVInvokedUrlCommand*)command;
-(void)imageCompress:(CDVInvokedUrlCommand*)command;
-(UIImage *) imageCompressForSize:(UIImage *)sourceImage targetSize:(CGSize)size;

-(void)readAsString:(CDVInvokedUrlCommand*)command;
-(void)writeAsString:(CDVInvokedUrlCommand*)command;
-(void)removeFile:(CDVInvokedUrlCommand*)command;


@end
