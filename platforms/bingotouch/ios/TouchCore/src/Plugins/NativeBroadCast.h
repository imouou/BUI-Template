
#import "TouchPlugin.h"

@interface NativeBroadCast : TouchPlugin

-(void)registerReceiver:(CDVInvokedUrlCommand*)command;

- (void)removeReceiver:(CDVInvokedUrlCommand *)command;

- (void)cleanReceiver:(CDVInvokedUrlCommand *)command;

@end
