#import "TouchPlugin.h"

@implementation TouchPlugin

-(TouchCoreViewController *)touchCoreVC
{
    TouchViewController* touchViewController = (TouchViewController*)self.viewController;
    return touchViewController.touchCore;
}

@end
