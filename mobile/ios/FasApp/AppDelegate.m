/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import "RCTRootView.h"
#import "RCTUtils.h"

#import "RCTPushNotificationManager.h"
#import "ReactNativeAutoUpdater.h"

#define JS_CODE_METADATA_URL @"http://114.55.16.46/fas/pub/rnupdate/meta?type=IOS_PATCH"

@interface AppDelegate() <ReactNativeAutoUpdaterDelegate>

@end

typedef enum{
  AutoUpdate,
  Local,
  Debug,
}AppStarMode;

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
//  [NSThread sleepForTimeInterval:1.0];

  AppStarMode startType=Debug;

  NSURL* latestJSCodeLocation;
  if(startType==AutoUpdate){
    NSURL* defaultJSCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];

    ReactNativeAutoUpdater* updater = [ReactNativeAutoUpdater sharedInstance];
    [updater setDelegate:self];
//    [updater showProgress: NO];

    // We set the location of the metadata file that has information about the JS Code that is shipped with the app.
    // This metadata is used to compare the shipped code against the updates.

    NSURL* defaultMetadataFileLocation = [[NSBundle mainBundle] URLForResource:@"metadata" withExtension:@"json"];
    [updater initializeWithUpdateMetadataUrl:[NSURL URLWithString:JS_CODE_METADATA_URL]
                       defaultJSCodeLocation:defaultJSCodeLocation
                 defaultMetadataFileLocation:defaultMetadataFileLocation ];
    [updater setHostnameForRelativeDownloadURLs:@"http://114.55.16.46"];
    [updater checkUpdate];

    latestJSCodeLocation = [updater latestJSCodeLocation];
  }else if(startType==Debug){
    latestJSCodeLocation=[NSURL URLWithString:@"http://192.168.64.235:8081/index.ios.bundle?platform=ios"];
  }else{
    latestJSCodeLocation=[[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  }



  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  self.window.rootViewController = rootViewController;
  RCTBridge* bridge = [[RCTBridge alloc] initWithBundleURL:latestJSCodeLocation moduleProvider:nil launchOptions:nil];
  RCTRootView* rootView = [[RCTRootView alloc] initWithBridge:bridge moduleName:@"FasApp" initialProperties:nil];
  //white flash between launchPage and homePage
  NSString *launchImageName = nil;
  if (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPhone) {
    CGFloat height = MAX([UIScreen mainScreen].bounds.size.width,[UIScreen mainScreen].bounds.size.height);
    if (height == 480) launchImageName = @"LaunchImage-700@2x.png"; // iPhone 4/4s
    else if (height == 568) launchImageName = @"LaunchImage-700-568h@2x.png"; // iPhone 5/5s
    else if (height == 667) launchImageName = @"LaunchImage-800-667h@2x.png"; // iPhone 6/6s
    else if (height == 736) launchImageName = @"LaunchImage-800-Portrait-736h@3x.png"; // iPhone 6+
  } else if (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPad) {
    CGFloat scale = RCTScreenScale();
    if (scale == 1) launchImageName = @"LaunchImage-700-Portrait~ipad.png"; // iPad
    else if (scale == 2) launchImageName = @"LaunchImage-700-Portrait@2x~ipad.png"; // Retina iPad
  }
  // Create loading view
  UIImage *image = [UIImage imageNamed:launchImageName];
  if (image) {
    UIImageView *imageView = [[UIImageView alloc] initWithFrame:[UIScreen mainScreen].bounds];
    imageView.contentMode = UIViewContentModeBottom;
    imageView.image = image;
    rootView.loadingView = imageView;
  }
  self.window.rootViewController.view = rootView;
  [self.window makeKeyAndVisible];
  return YES;
}

- (void)createReactRootViewFromURL:(NSURL*)url {
  // Make sure this runs on main thread. Apple does not want you to change the UI from background thread.
  dispatch_async(dispatch_get_main_queue(), ^{
    RCTBridge* bridge = [[RCTBridge alloc] initWithBundleURL:url moduleProvider:nil launchOptions:nil];
    RCTRootView* rootView = [[RCTRootView alloc] initWithBridge:bridge moduleName:@"FasApp" initialProperties:nil];
    self.window.rootViewController.view = rootView;
  });
}


#pragma mark - ReactNativeAutoUpdaterDelegate methods

- (void)ReactNativeAutoUpdater_updateDownloadedToURL:(NSURL *)url {
  UIAlertController *alertController = [UIAlertController
                                        alertControllerWithTitle:NSLocalizedString(@"版本升级", nil)
                                        message:NSLocalizedString(@"程序有新的版本更新，重新启动后生效", nil)
                                        preferredStyle:UIAlertControllerStyleAlert];



  UIAlertAction *okAction = [UIAlertAction
                             actionWithTitle:NSLocalizedString(@"确定", @"OK action")
                             style:UIAlertActionStyleDefault
                             handler:^(UIAlertAction *action)
                             {
                               NSLog(@"Cancel action");

                             }];


  [alertController addAction:okAction];

  // make sure this runs on main thread. Apple doesn't like if you change UI from background thread.
  dispatch_async(dispatch_get_main_queue(), ^{
    [self.window.rootViewController presentViewController:alertController animated:YES completion:nil];
  });

}

- (void)ReactNativeAutoUpdater_updateDownloadFailed {
  NSLog(@"Update failed to download");
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
{
        NSLog(@"调用的应用程序的Bundle ID是: %@", sourceApplication);
        NSLog(@"URL scheme:%@", [url scheme]);
        NSLog(@"URL query: %@", [url query]);
        return YES;
}

// Required to register for notifications
- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings
{
  [RCTPushNotificationManager didRegisterUserNotificationSettings:notificationSettings];
}
// Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  [RCTPushNotificationManager didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}
// Required for the notification event.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)notification
{
  [RCTPushNotificationManager didReceiveRemoteNotification:notification];
}
@end
