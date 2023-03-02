import { all, fork } from 'redux-saga/effects'
// import { watchLoadForum } from './Forum'

export default function* rootSaga() {
    yield all([
        // fork(watchLoadForum),
    ])
}