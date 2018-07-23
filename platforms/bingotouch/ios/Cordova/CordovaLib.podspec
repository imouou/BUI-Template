Pod::Spec.new do |s|


  s.name         = "CordovaLib"
  s.version      = "2.6.2"
  s.summary      = "Cordova SDK base on v2.6."

  s.ios.deployment_target = '7.0'

  s.description  = <<-DESC
  Description of CordovaLib.
                   DESC

  s.homepage     = "https://git.bingosoft.net/bingotouch/Cordova-iOS.git"

  s.license      = "MIT"

  s.author           = { 'yulsh' => 'yulsh@bingosoft.net' }

  s.source       = { :git => "https://git.bingosoft.net/bingotouch/Cordova-iOS.git", :tag => "#{s.version}" }

  s.source_files  = "src", "src/**/*.{h,m}"

  s.public_header_files = 'src/**/*.h'
end
