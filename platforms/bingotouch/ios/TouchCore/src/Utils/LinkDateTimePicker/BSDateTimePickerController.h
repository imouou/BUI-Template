//
//  BSAffairDateAndTimePickerController.h
//  BingoSled
//
//  Created by PointerTan on 14-5-28.
//  Copyright (c) 2014年 bingosoft. All rights reserved.
//

#import <UIKit/UIKit.h>
typedef  void(^DateTimePickerBlock)(NSDictionary* dateTimeDict, NSString *dateTimeString);
typedef enum {
    DateTimePickerDate,
    DateTimePickerTime,
    DateTimePickerDateTime
}DateATimeMode;

@interface BSDateTimePickerController : UIViewController

@property (nonatomic,strong) NSDate *defaultDate;
@property (nonatomic,strong) NSDictionary* defaultDateDict;
@property (nonatomic,strong) NSDictionary* yearRange;
@property (strong, nonatomic) IBOutlet UIView *pickView;
+ (BSDateTimePickerController *)controllerDatePickerWithMode:(DateATimeMode)mode format:(NSString*)format andBlock:(DateTimePickerBlock)block;
- (void)showPickerInView:(UIView*)superView;
@end
