#import "CDVRotation.h"
#import "TouchCoreViewController.h"

@implementation CDVRotation

-(void)setRotation:(CDVInvokedUrlCommand *)commmand
{
    NSString* rotation = commmand.arguments[0];
    
    NSUInteger toOrientation;
    if ([rotation isEqualToString:@"portrait"]) {
        toOrientation = UIInterfaceOrientationPortrait;
    }
    else if ([rotation isEqualToString:@"landscape"]){
        toOrientation = UIInterfaceOrientationLandscapeRight;
    }
    
    if ([self.touchCoreVC respondsToSelector:@selector(setRotation:)]) {
        [self.touchCoreVC performSelector:NSSelectorFromString(@"setRotation:") withObject:[NSNumber numberWithInteger:toOrientation]];
    }
}

@end
