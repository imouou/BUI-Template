

#import "TouchPlugin.h"
#import "EasyTimeline.h"


@interface TimeTaskPlugin : TouchPlugin

-(void)taskStart:(CDVInvokedUrlCommand*)command;
-(void)taskStop:(CDVInvokedUrlCommand*)command;

@end
