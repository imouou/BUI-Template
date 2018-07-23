#import "TouchPlugin.h"
#import <HooDatePicker/HooDatePicker.h>

@interface FormatDatePicker : TouchPlugin <HooDatePickerDelegate>

-(void)date:(CDVInvokedUrlCommand*)command;
-(void)time:(CDVInvokedUrlCommand*)command;
-(void)oneSelect:(CDVInvokedUrlCommand*)command;
@end
