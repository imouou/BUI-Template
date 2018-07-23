#import "FormatDatePicker.h"
#import "BSDateTimePickerController.h"
#import "BRStringPickerView.h"

@interface FormatDatePicker ()
@property NSString * callbackId;
@property BSDateTimePickerController* picker;
@property HooDatePicker * datePicker;
@property NSString * type;
@property CDVPluginResult* pluginResult;
@end

@implementation FormatDatePicker


-(void)date:(CDVInvokedUrlCommand *)command{
    _type = @"date";
    _callbackId =command.callbackId;
    NSDictionary* defaultDate=[command.arguments objectAtIndex:0];
    int year = [[defaultDate objectForKey:@"year"] intValue];
    int month = [[defaultDate objectForKey:@"month"] intValue]+1;
    int day = [[defaultDate objectForKey:@"day"] intValue]+1;
    NSString* format=[command.arguments objectAtIndex:1];
    NSDictionary* range=[command.arguments objectAtIndex:2];
    int minYear = [[range objectForKey:@"minYear"] intValue];
    int maxYear = [[range objectForKey:@"maxYear"] intValue];
    
    _datePicker =[[HooDatePicker alloc] initWithSuperView:self.touchCoreVC.view];
    _datePicker.delegate = self;
    _datePicker.datePickerMode = HooDatePickerModeDate;
    
    NSDateFormatter * dateFormate = [[NSDateFormatter alloc]init];
    [dateFormate setDateFormat:@"yyyy-MM-dd"];
    NSString * dateStr =[NSString stringWithFormat:@"%d-%d-%d",year,month,day];
    [_datePicker setDate:[dateFormate dateFromString:dateStr] animated:YES];
    [_datePicker setMinimumDate:[dateFormate dateFromString:[NSString stringWithFormat:@"%d-01-01",minYear]]];
    [_datePicker setMaximumDate:[dateFormate dateFromString:[NSString stringWithFormat:@"%d-12-31",maxYear]]];
    
    [_datePicker show];
}

-(void)datePicker:(HooDatePicker *)dataPicker didSelectedDate:(NSDate *)date{
    NSDateComponents *components = [[NSCalendar currentCalendar] components:NSDayCalendarUnit | NSMonthCalendarUnit | NSYearCalendarUnit fromDate:date];
    
    NSString* year = [NSString stringWithFormat:@"%ld",(long)[components year]];
    NSString* month = [NSString stringWithFormat:@"%ld",(long)[components month]];
    NSString* day = [NSString stringWithFormat:@"%ld",(long)[components day]];
    NSString* full = [NSString stringWithFormat:@"%@-%@-%@",year,month,day];
    NSDictionary * result =@{@"year":year
                             ,@"month":month
                             ,@"day":day,@"full":full};
    _pluginResult=[CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:[result JSONString]];
    [self.commandDelegate sendPluginResult:_pluginResult callbackId:_callbackId];
}


- (void)time:(CDVInvokedUrlCommand *)command
{
    NSDictionary* defaultDate=[command.arguments objectAtIndex:0];
    NSString* format=[command.arguments objectAtIndex:1];
    
    __weak __typeof(self)weakSelf = self;
    self.picker = [BSDateTimePickerController controllerDatePickerWithMode:DateTimePickerTime
                                                                                           format:format
                                                                                         andBlock:^(NSDictionary* dateDict, NSString *dateString) {
        NSMutableDictionary* returnValue = [NSMutableDictionary dictionaryWithDictionary:dateDict];
        [returnValue setObject:dateString forKey:@"full"];
        CDVPluginResult* pluginResult=[CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:[returnValue JSONString]];
        [weakSelf.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
    if (defaultDate && [defaultDate isKindOfClass:[NSDictionary class]] && defaultDate.count > 0) {
        self.picker.defaultDateDict = defaultDate;
    }
    [self.picker showPickerInView:self.viewController.view];
}

-(void)oneSelect:(CDVInvokedUrlCommand *)command{
    _callbackId=command.callbackId;
    NSArray * data = [command.arguments objectAtIndex:0];
    NSString* selectedKey = [command.arguments objectAtIndex:1];
    NSString* selectedValue =@"";
    NSString* title =[command.arguments objectAtIndex:2];
    
    NSMutableArray *arrayData = [NSMutableArray arrayWithCapacity:data.count];
    for (int i = 0; i < data.count; i++) {
        NSDictionary* obj=(NSDictionary*)[data objectAtIndex:i];
        NSString * key =[obj objectForKey:@"key"];
        NSString * value =[obj objectForKey:@"value"];
        if([selectedKey isEqualToString:key]){
            selectedValue =value;
        }
        arrayData[i]=value;
    }
    
    [BRStringPickerView showStringPickerWithTitle:@"" dataSource:arrayData defaultSelValue:selectedValue isAutoSelect:NO resultBlock:^(id selectValue) {
        //遍历找到选中的
        NSDictionary * selectedObj=nil;
        for (int i = 0; i < data.count; i++) {
            NSDictionary* obj=(NSDictionary*)[data objectAtIndex:i];
            NSString * value = [obj objectForKey:@"value"];
            if([value isEqualToString:selectValue]){
                selectedObj = obj;
            }
        }
        _pluginResult=[CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:[selectedObj JSONString]];
        [self.commandDelegate sendPluginResult:_pluginResult callbackId:_callbackId];
    }];
}

@end
