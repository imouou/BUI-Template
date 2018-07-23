#import "CDVSSOPlugin.h"
#import <AFNetworking/AFNetworking.h>

@interface CDVSSOPlugin()
@property (nonatomic, strong) AFHTTPRequestOperationManager* httpManager;
@end


@implementation CDVSSOPlugin

-(void)pluginInitialize{
    self.httpManager = [AFHTTPRequestOperationManager manager];
    self.httpManager.securityPolicy.allowInvalidCertificates=YES;
    self.httpManager.securityPolicy.validatesDomainName = NO;
    AFHTTPResponseSerializer* responseSerializer = [AFHTTPResponseSerializer serializer];
    NSMutableSet* acceptableContentTypes  = [NSMutableSet setWithSet:self.httpManager.responseSerializer.acceptableContentTypes];
    [acceptableContentTypes addObject:@"text/html"];
    self.httpManager.responseSerializer = responseSerializer;
}

-(void)login:(CDVInvokedUrlCommand *)command{
    NSDictionary* credential=[command.arguments objectAtIndex:0];
    NSString * username=[credential objectForKey:@"username"];
    NSString * password=[credential objectForKey:@"password"];
    NSString * clientId=[credential objectForKey:@"clientId"];
    NSString * clientSecret=[credential objectForKey:@"clientSecret"];
    
    if(clientId==nil||[clientId isEqualToString:@""]){
        clientId=@"ClientId";
    }
    if(clientSecret==nil||[clientSecret isEqualToString:@""]){
        clientSecret=@"ClientSecret";
    }
    
    NSMutableDictionary* params=[[NSMutableDictionary alloc] init];
    [params setObject:@"password" forKey:@"credential_type"];
    [params setObject:username forKey:@"username"];
    [params setObject:password forKey:@"password"];
    [params setObject:clientId forKey:@"openid.ex.client_id"];
    [params setObject:clientSecret forKey:@"openid.ex.client_secret"];
    [params setObject:@"y" forKey:@"openid.ex.get_oauth_access_token"];
    [params setObject:@"y" forKey:@"openid.ex.get_service_ticket"];
    [params setObject:@"y" forKey:@"openid.ex.get_spec_secret"];
    [params setObject:@"checkid_setup" forKey:@"openid.mode"];
    
    NSString * ssoServerUrl = [credential objectForKey:@"ssoServerUrl"];
    if(ssoServerUrl==nil||[ssoServerUrl isEqualToString:@""]){
        ssoServerUrl = [self.touchCoreVC.settings objectForKey:@"SsoServerUrl"];
    }
    NSString * url=[NSString stringWithFormat:@"%@/v2",ssoServerUrl];
    [self get:url withParameters:params withCallbackId:command.callbackId];
}


//todo 目前统一返回true
-(void)isLogined:(CDVInvokedUrlCommand *)command{
    CDVPluginResult* pluginResult=[CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"true"];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

//todo 目前统一返回success
-(void)logout:(CDVInvokedUrlCommand *)command{
    CDVPluginResult* pluginResult=[CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"success"];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

//todo 目前统一返回空字符串
-(void)loginTicket:(CDVInvokedUrlCommand *)command{
    CDVPluginResult* pluginResult=[CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@""];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

//todo 目前统一返回空字符串
-(void)serviceTicket:(CDVInvokedUrlCommand *)command{
    CDVPluginResult* pluginResult=[CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@""];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

//todo 目前统一返回空字符串
-(void)refreshToken:(CDVInvokedUrlCommand *)command{
    //config.getSSOEndpoint() + "/oauth/2/token?client_id=clientId&grant_type=refresh_token&refresh_token=" + token;
    CDVPluginResult* pluginResult=[CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@""];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

-(void)get:(NSString*)url withParameters:(NSDictionary*)parameters withCallbackId:(NSString*)callbackId{
    [self.httpManager.requestSerializer setValue:@"XMLHttpRequest" forHTTPHeaderField:@"X-Requested-With"];
    [self.httpManager GET:url parameters:parameters success:^(AFHTTPRequestOperation* operation,id responseObject){
        NSData * data=responseObject;
        NSString * result=[[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
        NSDictionary* response=[self getDictionary:result];
        CDVPluginResult* pluginResult=[CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:[response JSONString]];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:callbackId];
        
    } failure:^(AFHTTPRequestOperation* operation,NSError* error){
        NSLog(@"回调ID:%@, 错误信息:%@",callbackId,[error description]);
        CDVPluginResult* pluginResult=[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:[error description]];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:callbackId];
    }];
}


-(NSMutableDictionary*)getDictionary:(NSString*)responseData{
    NSArray * array=[responseData componentsSeparatedByString:@"\n"];
    NSMutableDictionary* dic=[[NSMutableDictionary alloc] init];
    NSInteger length = array.count;
    for (int i=0; i< length -1; i++) {
        if (array[i]!=nil) {
            id obj=[array[i] componentsSeparatedByString:@":"];
            NSString* key=obj[0];
            NSString* value=obj[1];
            [dic setObject:value forKey:key];
        }
    }
    return dic;
}

@end




