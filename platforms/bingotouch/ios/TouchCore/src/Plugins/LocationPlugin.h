

#import "TouchPlugin.h"
#import <CoreLocation/CoreLocation.h>
#import <MapKit/MapKit.h>

@interface LocationPlugin : TouchPlugin<CLLocationManagerDelegate>

@property(nonatomic,strong)CLLocationManager* locationManager;


-(void)location:(CDVInvokedUrlCommand*)commmand;
@end
