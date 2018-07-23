
#import "TouchPlugin.h"
#import <MessageUI/MessageUI.h>
#import <MessageUI/MFMessageComposeViewController.h>

@interface CDVPhonePlugin : TouchPlugin<MFMessageComposeViewControllerDelegate>

-(void)sms:(CDVInvokedUrlCommand*)command;
-(void)dial:(CDVInvokedUrlCommand*)command;
@end
