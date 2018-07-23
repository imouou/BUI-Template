
#import "BarcodeScannerPlugin.h"
#import "QRCodeReaderViewController.h"

@implementation BarcodeScannerPlugin{
    NSString * callbackId;
}

-(void)scan:(CDVInvokedUrlCommand *)command{
    if([self isSystemVersionReached:7.0]){
        callbackId=command.callbackId;
        static QRCodeReaderViewController * reader=nil;
        static dispatch_once_t onceToken;
    
        dispatch_once(&onceToken, ^{
            reader                        = [QRCodeReaderViewController new];
            reader.modalPresentationStyle = UIModalPresentationFormSheet;
        });
        reader.delegate = self;
        [self.viewController presentViewController:reader animated:YES completion:nil];
    }else{
        //7.0+
        NSLog(@"抱歉，当前iOS版本不支持该功能！");
        CDVPluginResult* pluginResult=[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"抱歉，当前iOS版本不支持该功能！"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }
}

- (BOOL)isSystemVersionReached:(float)version
{
    return [[UIDevice currentDevice].systemVersion floatValue] >= version;
}

#pragma mark - QRCodeReader Delegate Methods

- (void)reader:(QRCodeReaderViewController *)reader didScanResult:(NSString *)result
{
    [self.viewController dismissViewControllerAnimated:YES completion:^{
        CDVPluginResult* pluginResult;
        if(![result isEqualToString:@""]){
            pluginResult=[CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:result];
        }else{
            pluginResult=[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"抱歉,什么都没扫描到!"];
        }
        [self.commandDelegate sendPluginResult:pluginResult callbackId:callbackId];
    }];

}

- (void)readerDidCancel:(QRCodeReaderViewController *)reader
{
    [self.viewController dismissViewControllerAnimated:YES completion:NULL];
}

@end
