

#import "LocationPlugin.h"

@implementation LocationPlugin{
    NSString * callbackId;
}
@synthesize locationManager;

-(void)location:(CDVInvokedUrlCommand *)commmand{
    callbackId=commmand.callbackId;
    self.locationManager=[[CLLocationManager alloc]init];
    self.locationManager.delegate = self;
    if ([self.locationManager respondsToSelector:@selector(requestAlwaysAuthorization)]) {
        [self.locationManager requestAlwaysAuthorization];
    }
    self.locationManager.desiredAccuracy = kCLLocationAccuracyBest;
    self.locationManager.distanceFilter = kCLDistanceFilterNone;
    
    if([CLLocationManager locationServicesEnabled]){
        [self.locationManager startUpdatingLocation];
    }else{
        NSLog(@"定位失败，请检查定位服务是否开启");
        CDVPluginResult * pluginResult=[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"定位失败，请检查定位服务是否开启"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:callbackId];
    }
}

//ios8需要授权，并且在plist里面设置两个属性
- (void)locationManager:(CLLocationManager *)manager didChangeAuthorizationStatus:(CLAuthorizationStatus)status {
    switch (status) {
        case kCLAuthorizationStatusNotDetermined:
        if ([locationManager respondsToSelector:@selector(requestAlwaysAuthorization)]) {
            [locationManager requestWhenInUseAuthorization];
        }
        break;
        default:
        break;
    }
}

-(void)locationManager:(CLLocationManager *)manager didFailWithError:(NSError *)error{
    NSLog(@"error:%@",error);
    CDVPluginResult * pluginResult=[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"定位失败，请检查定位服务是否开启"];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:callbackId];
}

-(void)locationManager:(CLLocationManager *)manager didUpdateToLocation:(CLLocation *)newLocation fromLocation:(CLLocation *)oldLocation{
    // 获取经纬度
    NSLog(@"纬度:%f",newLocation.coordinate.latitude);
    NSLog(@"经度:%f",newLocation.coordinate.longitude);
    
    NSString * lat=[NSString stringWithFormat:@"%f",newLocation.coordinate.latitude] ;
    NSString * log=[NSString stringWithFormat:@"%f",newLocation.coordinate.longitude];
    
    NSDictionary* result=[[NSDictionary alloc] initWithObjectsAndKeys:log,@"longitude",
    lat,@"latitude",@"native",@"locFrom",@"gps",@"locType",
     nil];
    
    CDVPluginResult* pluginResult=[CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:[NSString stringWithFormat:@"%@",[result JSONString]]];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:callbackId];
    
    // 停止位置更新
    [manager stopUpdatingLocation];
}

@end
