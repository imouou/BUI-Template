
#import "CDVPhonePlugin.h"

@implementation CDVPhonePlugin

-(void)sms:(CDVInvokedUrlCommand*)command{
    NSString* phoneNums=[command.arguments objectAtIndex:0];
    NSString* message=[command.arguments objectAtIndex:1];
    Class messageClass = (NSClassFromString(@"MFMessageComposeViewController"));
    if (messageClass!=nil) {
        if (![messageClass canSendText]) {
			UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Notice" message:@"SMS Text not available."
														   delegate:self cancelButtonTitle:@"OK" otherButtonTitles: nil];
			[alert show];
			return;
        }
        MFMessageComposeViewController *picker = [[MFMessageComposeViewController alloc] init];
        picker.messageComposeDelegate = self;
        if(message != nil){
            picker.body =message;
        }
        if(phoneNums != nil){
            [picker setRecipients:[ phoneNums componentsSeparatedByString:@","]];
         }
        [self.viewController presentModalViewController:picker animated:YES];
    }
}
- (void)messageComposeViewController:(MFMessageComposeViewController *)controller didFinishWithResult:(MessageComposeResult)result
{
//	int webviewResult = 0;
//	switch (result)
//	{
//		case MessageComposeResultCancelled:
//			webviewResult = 0;
//			break;
//		case MessageComposeResultSent:
//			webviewResult = 1;
//			break;
//		case MessageComposeResultFailed:
//			webviewResult = 2;
//			break;
//		default:
//			webviewResult = 3;
//			break;
//	}
    [self.viewController dismissModalViewControllerAnimated:YES];
}


-(void)dial:(CDVInvokedUrlCommand*)command{
    NSString* phone=[command.arguments objectAtIndex:0];
    if (phone!=nil) {
        NSString* url=[NSString stringWithFormat:@"tel://%@",phone];
        [[UIApplication sharedApplication] openURL:[NSURL URLWithString:url]];
    }
}

@end
