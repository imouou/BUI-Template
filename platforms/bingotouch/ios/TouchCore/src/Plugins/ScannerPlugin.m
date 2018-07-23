#import "ScannerPlugin.h"
#import "ZFScanViewController.h"

@implementation ScannerPlugin

-(void)scan:(CDVInvokedUrlCommand *)command{
    ZFScanViewController * vc = [[ZFScanViewController alloc] init];
    vc.returnScanBarCodeValue = ^(NSString * barCodeString){
        CDVPluginResult * pluginResult;
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:barCodeString];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    };
    [self.touchCoreVC presentViewController:vc animated:YES completion:nil];
}

@end
