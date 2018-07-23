
#import "TouchPlugin.h"

@interface CDVSettingPlugin : TouchPlugin

-(void)set:(CDVInvokedUrlCommand*)command;
-(void)get:(CDVInvokedUrlCommand*)command;
-(void)remove:(CDVInvokedUrlCommand*)command;
-(void)clear:(CDVInvokedUrlCommand*)command;
-(void)load:(CDVInvokedUrlCommand*)command;
@end
