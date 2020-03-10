import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import rootStoreCtx from '../../../stores';
import Header from '../../Header';
import Loading from '../../ui/Loading';

const AppWrapper = observer(({ children }) => {
    const {
        uiStore: { isLoading, requestStatus: { isPending } },
    } = useContext(rootStoreCtx);

    const disableEvent = (e) => {
        e.stopPropagation();
    };

    const disableWhileLoading = isLoading ? disableEvent : undefined;

    return (
        <div
            onKeyPressCapture={disableWhileLoading}
            onClickCapture={disableWhileLoading}
        >
            <Header />
            {isLoading && !isPending && (<Loading />)}
            {children}
        </div>
    );
});

export default AppWrapper;
