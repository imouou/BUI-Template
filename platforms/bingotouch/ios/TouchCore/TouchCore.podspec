Pod::Spec.new do |s|


  s.name         = "TouchCore"
  s.version      = "1.9.1"
  s.summary      = "TouchCore SDK"

  s.ios.deployment_target = '8.0'

  s.description  = <<-DESC
  Description of TouchCore.
                   DESC

  s.homepage     = "https://git.bingosoft.net/bingotouch/TouchCore-iOS.git"

  s.license      = "MIT"

  s.author           = { 'yulsh' => 'yulsh@bingosoft.net' }

  s.source       = { :git => "https://git.bingosoft.net/bingotouch/TouchCore-iOS.git", :tag => "#{s.version}" }

  s.source_files  = "src", "src/**/*.{h,m}"

  s.public_header_files = 'src/**/*.h'

  s.resources =["src/**/*.png"]

  s.dependency 'CordovaLib', '~> 2.6.2'
  s.dependency 'JSONKit-NoWarning', '~>1.2'
  s.dependency 'AFNetworking', '~> 2.6.0'
  s.dependency 'HooDatePicker', '~> 1.0'
  s.dependency 'MJExtension'
end
