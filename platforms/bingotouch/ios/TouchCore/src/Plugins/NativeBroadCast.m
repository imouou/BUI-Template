

#import "NativeBroadCast.h"

@implementation NativeBroadCast

-(void)registerReceiver:(CDVInvokedUrlCommand *)command
{
    NSString* key = [command.arguments objectAtIndex:0];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onReceiveNotification:) name:key object:nil];
}

- (void)removeReceiver:(CDVInvokedUrlCommand *)command
{
    NSString* key = [command.arguments objectAtIndex:0];
    [[NSNotificationCenter defaultCenter] removeObserver:self name:key object:nil];
}

- (void)cleanReceiver:(CDVInvokedUrlCommand *)command
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)onReceiveNotification:(NSNotification*)notification
{
    NSString* key = notification.name;
    NSString* data = [notification.userInfo JSONString];
    NSString* execJs = [NSString stringWithFormat:@"nativeCallback('%@','%@')", key,data];
//    dispatch_async(dispatch_get_main_queue(), ^{
//        [self.webView stringByEvaluatingJavaScriptFromString:execJs];
//    });
    [self.webView performSelectorOnMainThread:@selector(stringByEvaluatingJavaScriptFromString:) withObject:execJs waitUntilDone:NO];
}

-(void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

@end
