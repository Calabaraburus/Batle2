import { native } from 'cc';

export class ReviewCaller {
    public callReview() {
        native.jsbBridgeWrapper.dispatchEventToNative("requestReviewCall");
    }
}