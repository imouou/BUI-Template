#import "TouchPlugin.h"

@interface CDVSSOPlugin : TouchPlugin

-(void)login:(CDVInvokedUrlCommand*)command;
-(void)logout:(CDVInvokedUrlCommand*)command;
-(void)refreshToken:(CDVInvokedUrlCommand*)command;
-(void)loginTicket:(CDVInvokedUrlCommand*)command;
-(void)serviceTicket:(CDVInvokedUrlCommand*)command;
-(void)isLogined:(CDVInvokedUrlCommand*)command;

-(void)get:(NSString*)url withParameters:(NSDictionary*)parameters withCallbackId:(NSString*)callbackId;
@end
