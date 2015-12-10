#include <nan.h>

using namespace v8;

NAN_METHOD(RunTest) {
  Nan::HandleScope scope;
  Local<Number> num = Nan::To<Number>(info[0]).ToLocalChecked();
  int sleep = num->IntegerValue();

  Local<Function> callback = info[1].As<Function>();

  Nan::Callback* nanCallback = new Nan::Callback(callback);
  MyWorker* worker = new MyWorker(nanCallback, sleep);

  Nan::AsyncQueueWorker(worker);
  // get delay and callback
  // create NanCallback instance wrapping the callback
  // create a MyWorker instance, passing the callback and delay
  // queue the worker instance onto the thread-pool
}

NAN_MODULE_INIT(Init) {
  Nan::Set(target, Nan::New("runTest").ToLocalChecked(),
      Nan::GetFunction(Nan::New<FunctionTemplate>(RunTest)).ToLocalChecked());
}

NODE_MODULE(native-hufter, Init)
