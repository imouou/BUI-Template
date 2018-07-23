#import "TouchPlugin.h"
#import <AFNetworking/AFNetworking.h>

@interface HttpRequestPlugin : TouchPlugin

-(void)ajax:(CDVInvokedUrlCommand*)command;
@end
