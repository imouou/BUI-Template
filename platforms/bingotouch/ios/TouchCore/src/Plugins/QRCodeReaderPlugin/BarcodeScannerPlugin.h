
#import "TouchPlugin.h"
#import "QRCodeReaderDelegate.h"

@interface BarcodeScannerPlugin : TouchPlugin<QRCodeReaderDelegate>

-(void) scan:(CDVInvokedUrlCommand*)command;

@end
