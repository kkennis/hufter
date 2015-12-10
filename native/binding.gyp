{
  "targets": [
    {
      "target_name": "native-hufter",
      "sources": [ "native-hufter.cc" ],
      "include_dirs": [ "<!(node -e \"require('nan')\")" ]
    }
  ]
}
