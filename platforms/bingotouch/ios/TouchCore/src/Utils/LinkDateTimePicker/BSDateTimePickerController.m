//
//  BSDateTimePickerController.m
//  BingoSled
//
//  Created by PointerTan on 14-5-28.
//  Copyright (c) 2014年 bingosoft. All rights reserved.
//

#import "BSDateTimePickerController.h"

#define currentMonth [currentMonthString integerValue]

@interface BSDateTimePickerController ()<UIPickerViewDataSource,UIPickerViewDelegate>
#pragma mark - IBActions
@property (strong, nonatomic) IBOutlet UITextField *textFieldEnterDate;
@property (strong, nonatomic) UIView* pickerContainer;
@property (strong, nonatomic) IBOutlet UIToolbar *toolbarCancelDone;
@property (strong, nonatomic) IBOutlet UIPickerView *customPicker;
#pragma mark - IBActions
- (IBAction)actionCancel:(id)sender;
- (IBAction)actionDone:(id)sender;
- (IBAction)clearDate:(id)sender;

@property (nonatomic)NSInteger numberOfComponents;
@property (nonatomic)DateATimeMode mode;
@property (nonatomic,copy) NSString* format;
@property (nonatomic,strong)DateTimePickerBlock block;
@end

@implementation BSDateTimePickerController
{
    NSMutableArray *yearArray;
    NSArray *monthArray;
    NSMutableArray *DaysArray;
    NSArray *amPmArray;
    NSArray *hoursArray;
    NSMutableArray *minutesArray;
    NSString *currentMonthString;
    int selectedYearRow;
    int selectedMonthRow;
    int selectedDayRow;
    BOOL firstTimeLoad;
    BOOL hasYear;
    BOOL hasMonth;
    BOOL hasDay;
    BOOL hasHour;
    BOOL hasMinute;
}

+ (BSDateTimePickerController *)controllerDatePickerWithMode:(DateATimeMode)mode format:(NSString*)format andBlock:(DateTimePickerBlock)block{
    BSDateTimePickerController *controller = [[BSDateTimePickerController alloc] init];
    controller.mode = mode;
    controller.format = format;
    controller.block = block;
    [controller configPickerComponentsWithMode:mode andFormat:format];
    return controller;
}

- (id)init
{
    self = [super init];
    if (self) {
        // Custom initialization
        hasYear = NO;
        hasMonth = NO;
        hasDay = NO;
        hasHour = NO;
        hasMinute = NO;
    }
    return self;
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
    firstTimeLoad = YES;
    
    self.pickView =  [[UIView alloc] initWithFrame:self.view.bounds];
    self.pickView.autoresizingMask = UIViewAutoresizingFlexibleHeight | UIViewAutoresizingFlexibleWidth;
    [self.view addSubview:self.pickView];
    
    UIView* grayBackgroud = [[UIView alloc] initWithFrame:self.pickView.bounds];
    grayBackgroud.backgroundColor = [UIColor colorWithWhite:0 alpha:0.5];
    grayBackgroud.autoresizingMask = UIViewAutoresizingFlexibleHeight | UIViewAutoresizingFlexibleWidth;
    UITapGestureRecognizer* tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(actionCancel:)];
    [grayBackgroud addGestureRecognizer:tap];
    
    [self.pickView addSubview:grayBackgroud];
    
    self.pickerContainer = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 320, 208)];
    [self.pickView addSubview:self.pickerContainer];
    
    self.customPicker = [[UIPickerView alloc] initWithFrame:CGRectMake(0, 44, 320, 162)];
    self.customPicker.backgroundColor = [UIColor whiteColor];
    self.customPicker.autoresizingMask = UIViewAutoresizingFlexibleTopMargin | UIViewAutoresizingFlexibleWidth;
    self.customPicker.delegate = self;
    self.customPicker.dataSource = self;
    [self.pickerContainer addSubview:self.customPicker];
    
    self.toolbarCancelDone = [[UIToolbar alloc] initWithFrame:CGRectMake(0, 0, 320, 44)];
    self.toolbarCancelDone.autoresizingMask = UIViewAutoresizingFlexibleTopMargin | UIViewAutoresizingFlexibleWidth;
    
    UIBarButtonItem* cancel = [[UIBarButtonItem alloc] initWithTitle:@"取消" style:UIBarButtonItemStyleBordered target:self action:@selector(actionCancel:)];
    UIBarButtonItem* done = [[UIBarButtonItem alloc] initWithTitle:@"确定" style:UIBarButtonItemStyleBordered target:self action:@selector(actionDone:)];
    UIBarButtonItem* space = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemFlexibleSpace target:nil action:nil];
    self.toolbarCancelDone.items = @[cancel, space, done];
    
    [self.pickerContainer addSubview:self.toolbarCancelDone];
    
    BOOL isPad = [UIDevice currentDevice].userInterfaceIdiom == UIUserInterfaceIdiomPad;
    [self configUIForDevice:isPad];
    
    
    [self initPIckerData];
}

- (void)configUIForDevice:(BOOL)isPad
{
    if (!isPad) {
        CGRect containerFrame = self.pickerContainer.frame;
        containerFrame.origin.y = self.pickView.frame.size.height - containerFrame.size.height;
        containerFrame.size.width = self.pickView.frame.size.width;
        self.pickerContainer.frame = containerFrame;
    }
    else {
        self.pickerContainer.autoresizingMask = UIViewAutoresizingNone;
        self.pickerContainer.center = CGPointMake(CGRectGetMidX(self.pickView.frame),CGRectGetMidY(self.pickView.frame));
    }
}


- (void)initPIckerData
{
    NSString* currentyearString = nil;
    NSString* currentDateString = nil;
    NSString* currentHourString = nil;
    NSString* currentMinutesString = nil;
    
    if (self.defaultDateDict && self.defaultDateDict.count > 0) {
        int year = [self.defaultDateDict[@"year"] intValue];
        int mouth = [self.defaultDateDict[@"month"] intValue];
        int day = [self.defaultDateDict[@"day"] intValue];
        int hour = [self.defaultDateDict[@"hour"] intValue];
        int minute = [self.defaultDateDict[@"minute"] intValue];
        currentyearString = [NSString stringWithFormat:@"%d", year];
        currentMonthString = [NSString stringWithFormat:@"%d", mouth>0?mouth:1];
        currentDateString = [NSString stringWithFormat:@"%02d", day>0?day:1];
        currentHourString = [NSString stringWithFormat:@"%02d", hour];
        currentMinutesString = [NSString stringWithFormat:@"%02d", minute];
    }
    else {
        NSDate *date = self.defaultDate ? self.defaultDate : [NSDate date];
        // Get Current Year
        NSDateFormatter *formatter = [[NSDateFormatter alloc]init];
        [formatter setDateFormat:@"yyyy"];
        currentyearString = [NSString stringWithFormat:@"%@",
                             [formatter stringFromDate:date]];
        // Get Current  Month
        [formatter setDateFormat:@"MM"];
        currentMonthString = [NSString stringWithFormat:@"%d",[[formatter stringFromDate:date]integerValue]];
        // Get Current  Date
        [formatter setDateFormat:@"d"];
        currentDateString = [NSString stringWithFormat:@"%@",[formatter stringFromDate:date]];
        
        // Get Current  Hour
        [formatter setDateFormat:@"HH"];
        currentHourString = [NSString stringWithFormat:@"%@",[formatter stringFromDate:date]];
        // Get Current  Minutes
        [formatter setDateFormat:@"mm"];
        currentMinutesString = [NSString stringWithFormat:@"%@",[formatter stringFromDate:date]];
    }
    
    
    // PickerView -  Years data
    yearArray = [[NSMutableArray alloc]init];
    int minYear = [self.yearRange[@"minYear"] intValue];
    minYear = minYear == 0?1970:minYear;
    int maxYear = [self.yearRange[@"maxYear"] intValue];
    maxYear = maxYear == 0?2050:maxYear;
    for (int i = minYear; i <= maxYear ; i++)
    {
        [yearArray addObject:[NSString stringWithFormat:@"%d",i]];
    }
    
    // PickerView -  Months data
    monthArray = @[@"1",@"2",@"3",@"4",@"5",@"6",@"7",@"8",@"9",@"10",@"11",@"12"];
    // PickerView -  Hours data
    hoursArray = @[@"00",@"01",@"02",@"03",@"04",@"05",@"06",@"07",@"08",@"09",@"10",@"11",@"12",@"13",@"14",@"15",@"16",@"17",@"18",@"19",@"20",@"21",@"22",@"23"];
    // PickerView -  Hours data
    minutesArray = [[NSMutableArray alloc]init];
    for (int i = 0; i < 60; i++)
    {
        [minutesArray addObject:[NSString stringWithFormat:@"%02d",i]];
    }
    
    // PickerView -  AM PM data
    amPmArray = @[@"AM",@"PM"];
    
    // PickerView -  days data
    DaysArray = [[NSMutableArray alloc]init];
    for (int i = 1; i <= 31; i++)
    {
        [DaysArray addObject:[NSString stringWithFormat:@"%d",i]];
    }
    
    switch (self.mode) {
        case DateTimePickerDate:
            if (hasYear) [self.customPicker selectRow:[yearArray indexOfObject:currentyearString] inComponent:0 animated:YES];
            if (hasMonth) [self.customPicker selectRow:[monthArray indexOfObject:currentMonthString] inComponent:1 animated:YES];
            if (hasDay) [self.customPicker selectRow:[DaysArray indexOfObject:currentDateString] inComponent:2 animated:YES];
            break;
        case DateTimePickerTime:
            if (hasHour) [self.customPicker selectRow:[hoursArray indexOfObject:currentHourString] inComponent:0 animated:YES];
            if (hasMinute) [self.customPicker selectRow:[minutesArray indexOfObject:currentMinutesString] inComponent:1 animated:YES];
            break;
        case DateTimePickerDateTime:
            if (hasYear) [self.customPicker selectRow:[yearArray indexOfObject:currentyearString] inComponent:0 animated:YES];
            if (hasMonth) [self.customPicker selectRow:[monthArray indexOfObject:currentMonthString] inComponent:1 animated:YES];
            if (hasDay) [self.customPicker selectRow:[DaysArray indexOfObject:currentDateString] inComponent:2 animated:YES];
            if (hasHour) [self.customPicker selectRow:[hoursArray indexOfObject:currentHourString] inComponent:3 animated:YES];
            if (hasMinute) [self.customPicker selectRow:[minutesArray indexOfObject:currentMinutesString] inComponent:4 animated:YES];
            break;
        default:
            break;
    }
}

- (void)configPickerComponentsWithMode:(DateATimeMode)mode andFormat:(NSString*)format
{
    if (mode==DateTimePickerDate || mode==DateTimePickerDateTime) {
        hasYear = YES;
        hasMonth = YES;
        hasDay = YES;
    }
    if (mode==DateTimePickerTime || mode==DateTimePickerDateTime) {
        hasHour = YES;
        hasMinute = YES;
    }

    if (format != nil && format.length > 0) {
        hasYear = hasYear && ([format rangeOfString:@"y" options:NSCaseInsensitiveSearch].location != NSNotFound);
        hasMonth = hasMonth && ([format rangeOfString:@"M"].location != NSNotFound);
        hasDay = hasDay && ([format rangeOfString:@"d" options:NSCaseInsensitiveSearch].location != NSNotFound);
        hasHour = hasHour && ([format rangeOfString:@"H" options:NSCaseInsensitiveSearch].location != NSNotFound);
        hasMinute = hasMinute && ([format rangeOfString:@"m"].location != NSNotFound);
    }
    
    self.numberOfComponents = 0;
    
    if (hasYear) self.numberOfComponents++;
    if (hasMonth) self.numberOfComponents++;
    if (hasDay) self.numberOfComponents++;
    if (hasHour) self.numberOfComponents++;
    if (hasMinute) self.numberOfComponents++;
    
    return;
    
}

#pragma mark - UIPickerViewDelegate


- (void)pickerView:(UIPickerView *)pickerView didSelectRow:(NSInteger)row inComponent:(NSInteger)component
{
    switch (self.mode) {
        case DateTimePickerDate:
        case DateTimePickerDateTime:{
            if (component == 0)
            {
                selectedYearRow = row;
                [self.customPicker reloadAllComponents];
            }
            else if (component == 1)
            {
                selectedMonthRow = row;
                [self.customPicker reloadAllComponents];
            }
            else if (component == 2)
            {
                selectedDayRow = row;
                [self.customPicker reloadAllComponents];
            }
            break;
        }
        case DateTimePickerTime:
            break;
        default:
            break;
    }
}


#pragma mark - UIPickerViewDatasource

- (UIView *)pickerView:(UIPickerView *)pickerView
            viewForRow:(NSInteger)row
          forComponent:(NSInteger)component
           reusingView:(UIView *)view {
    
    // Custom View created for each component
    
    UILabel *pickerLabel = (UILabel *)view;
    
    if (pickerLabel == nil) {
        CGRect frame = CGRectMake(0.0, 0.0,[pickerView rowSizeForComponent:component].width,[pickerView rowSizeForComponent:component].height);
        pickerLabel = [[UILabel alloc] initWithFrame:frame];
        [pickerLabel setTextAlignment:NSTextAlignmentCenter];
        [pickerLabel setBackgroundColor:[UIColor clearColor]];
        [pickerLabel setFont:[UIFont systemFontOfSize:20.0f]];
    }
    
    switch (self.mode) {
        case DateTimePickerDate:
        case DateTimePickerDateTime:{
            if (component == 0){
                pickerLabel.text =  [yearArray objectAtIndex:row]; // Year
            }
            else if (component == 1){
                pickerLabel.text =  [monthArray objectAtIndex:row];  // Month
            }
            else if (component == 2){
                
                pickerLabel.text =  [DaysArray objectAtIndex:row]; // Date
            }
            else if (component == 3){
                pickerLabel.text =  [hoursArray objectAtIndex:row]; // Hours
            }
            else if (component == 4){
                pickerLabel.text =  [minutesArray objectAtIndex:row]; // Mins
            }
        }
            break;
        case DateTimePickerTime:{
            if (component == 0){
                pickerLabel.text =  [hoursArray objectAtIndex:row]; // Hours
            }
            else if (component == 1){
                pickerLabel.text =  [minutesArray objectAtIndex:row]; // Mins
            }
        }
            break;
        default:
            break;
    }
//    else{
//        pickerLabel.text =  [amPmArray objectAtIndex:row]; // AM/PM
//    }
    
//    if ([pickerView selectedRowInComponent:component] == row) {
//        [pickerLabel setFont:[UIFont systemFontOfSize:22.0f]];
//    }
    return pickerLabel;
}

//- (CGFloat)pickerView:(UIPickerView *)pickerView rowHeightForComponent:(NSInteger)component{
//    return 50;
//}

- (NSInteger)numberOfComponentsInPickerView:(UIPickerView *)pickerView
{
    return self.numberOfComponents;
    }

- (CGFloat)pickerView:(UIPickerView *)pickerView widthForComponent:(NSInteger)component{
    switch (self.mode) {
        case DateTimePickerDate:{
            CGFloat perWidth = pickerView.frame.size.width/5;
            if (component == 0 || component == 2) {
                return perWidth*2;
            }
            else{
                return perWidth;
            }
        }
        case DateTimePickerDateTime:
            return  pickerView.frame.size.width/5;
        case DateTimePickerTime:
            return pickerView.frame.size.width/2;
        default:
            break;
    }
}

//- (NSString *)pickerView:(UIPickerView *)pickerView titleForRow:(NSInteger)row forComponent:(NSInteger)component{
//    switch (component) {
//        case 0:
//            return @"年";
//            break;
//        case 1:
//            return @"月";
//            break;
//        case 2:
//            return @"日";
//            break;
//        case 3:
//            return @"时";
//            break;
//        case 4:
//            return @"分";
//            break;
//        default:
//            break;
//    }
//    return nil;
//}

// returns the # of rows in each component..
- (NSInteger)pickerView:(UIPickerView *)pickerView numberOfRowsInComponent:(NSInteger)component
{
    switch (self.mode) {
        case DateTimePickerDate:
        case DateTimePickerDateTime:
            return [self numberOfRowsInComponents:component];
        case DateTimePickerTime:{
            if (component == 0){ // hour
                return 24;
            }
            else if (component == 1){ // min
                return 60;
            }
        }
        default:
            return 0;
    }
}

- (NSInteger)numberOfRowsInComponents:(NSInteger)component{
    if (component == 0)
    {
        return [yearArray count];
    }
    else if (component == 1)
    {
        return [monthArray count];
    }
    else if (component == 2)
    {
        if (firstTimeLoad)
        {
            firstTimeLoad = NO;
            if (currentMonth == 1 || currentMonth == 3 || currentMonth == 5 || currentMonth == 7 || currentMonth == 8 || currentMonth == 10 || currentMonth == 12)
            {
                return 31;
            }
            else if (currentMonth == 2){
                int yearint = [[yearArray objectAtIndex:selectedYearRow]intValue ];
                if(((yearint %4==0)&&(yearint %100!=0))||(yearint %400==0)){
                    return 29;
                }
                else
                {
                    return 28; // or return 29
                }
            }
            else
            {
                return 30;
            }
        }else{
            if (selectedMonthRow == 0 || selectedMonthRow == 2 || selectedMonthRow == 4 || selectedMonthRow == 6 || selectedMonthRow == 7 || selectedMonthRow == 9 || selectedMonthRow == 11)
            {
                return 31;
            }
            else if (selectedMonthRow == 1)
            {
                int yearint = [[yearArray objectAtIndex:selectedYearRow]intValue ];
                if(((yearint %4==0)&&(yearint %100!=0))||(yearint %400==0)){
                    return 29;
                }
                else
                {
                    return 28; // or return 29
                }
            }
            else
            {
                return 30;
            }
        }
    }
    else if (component == 3)
    { // hour
        return 24;
    }
    else if (component == 4)
    { // min
        return 60;
    }
    else
    { // am/pm
        return 2;
    }
}

- (IBAction)actionCancel:(id)sender
{
    [self hidePickerView];
}

- (IBAction)actionDone:(id)sender
{
    NSDictionary* dict = [self resultDateDict];
    NSString *text = [self resultDateText];
    self.block(dict, text);
    [self hidePickerView];
}

- (IBAction)clearDate:(id)sender {
    NSString *text = @"";
    self.block(nil, text);
    [self hidePickerView];
}

- (void)showPickerInView:(UIView*)superView
{
    if (![self isViewLoaded]) {
        [self view];
    }
    self.pickView.frame = superView.bounds;
    [superView addSubview:self.pickView];
    self.pickView.alpha = 0.0;
    [UIView animateWithDuration:0.2 delay:0 options: UIViewAnimationOptionCurveEaseIn
                     animations:^{
                         self.pickView.alpha = 1.0;
                     }
                     completion:^(BOOL finished){
                     }];
}

- (void)hidePickerView
{
    [UIView animateWithDuration:0.2
                          delay:0
                        options: UIViewAnimationOptionCurveEaseIn
                     animations:^{
                         self.pickView.alpha = 0.0;
                     }
                     completion:^(BOOL finished){
                         [self.pickView removeFromSuperview];
                     }];
}

- (NSString*)resultDateText
{
    NSString *text = @"";
    switch (self.mode) {
        case DateTimePickerDate:{
            if (hasDay) {
                text = [NSString stringWithFormat:@"%@-%@-%@",[yearArray objectAtIndex:[self.customPicker selectedRowInComponent:0]],[monthArray objectAtIndex:[self.customPicker selectedRowInComponent:1]],[DaysArray objectAtIndex:[self.customPicker selectedRowInComponent:2]]];
            }
            else if (hasMonth) {
                text = [NSString stringWithFormat:@"%@-%@",[yearArray objectAtIndex:[self.customPicker selectedRowInComponent:0]],[monthArray objectAtIndex:[self.customPicker selectedRowInComponent:1]]];
            }
            else {
                text = [NSString stringWithFormat:@"%@",[yearArray objectAtIndex:[self.customPicker selectedRowInComponent:0]]];
            }
        }
            break;
        case DateTimePickerDateTime:{
            text = [NSString stringWithFormat:@"%@-%@-%@  %@:%@",[yearArray objectAtIndex:[self.customPicker selectedRowInComponent:0]],[monthArray objectAtIndex:[self.customPicker selectedRowInComponent:1]],[DaysArray objectAtIndex:[self.customPicker selectedRowInComponent:2]],[hoursArray objectAtIndex:[self.customPicker selectedRowInComponent:3]],[minutesArray objectAtIndex:[self.customPicker selectedRowInComponent:4]]];
        }
            break;
        case DateTimePickerTime:{
            if (hasMinute) {
                text = [NSString stringWithFormat:@"%@:%@",[hoursArray objectAtIndex:[self.customPicker selectedRowInComponent:0]],[minutesArray objectAtIndex:[self.customPicker selectedRowInComponent:1]]];
            }
            else {
                text = [NSString stringWithFormat:@"%@",[hoursArray objectAtIndex:[self.customPicker selectedRowInComponent:0]]];
            }
        }
            break;
        default:
            break;
    }
    return text;
}

- (NSDictionary*)resultDateDict
{
    NSMutableDictionary* dict = [NSMutableDictionary dictionary];
    
    int index = 0;
    if (hasYear) {
        [dict setObject:[yearArray objectAtIndex:[self.customPicker selectedRowInComponent:index]] forKey:@"year"];
        index++;
    }
    if (hasMonth) {
        [dict setObject:[monthArray objectAtIndex:[self.customPicker selectedRowInComponent:index]] forKey:@"month"];
        index++;
    }
    if (hasDay) {
        [dict setObject:[DaysArray objectAtIndex:[self.customPicker selectedRowInComponent:index]] forKey:@"day"];
        index ++;
    }
    if (hasHour) {
        [dict setObject:[hoursArray objectAtIndex:[self.customPicker selectedRowInComponent:index]] forKey:@"hour"];
        index++;
    }
    if (hasMinute) {
        [dict setObject:[minutesArray objectAtIndex:[self.customPicker selectedRowInComponent:1]] forKey:@"minute"];
    }
    return dict;
}

@end
