import React from 'react';
import './options.pcss';

const Options = () => (
    <div className="tabstack-bottom tab-main tab-switch-tab" tab-switch="main">
        <div className="actions">
            <div className="action openAssistant">
                <span className="act-icon">
                    <img
                        // src="../../../assets/images/arrow-back.svg/block-ad.svg"
                        src="../../../assets/images/block-ad.svg"
                        className="icon-block-ad"
                        alt=""
                    />
                </span>
                <span
                    className="act-name"
                    i18n="popup_block_site_ads"
                    role="button"
                    tabIndex="0"
                >
Block ads&nbsp;on&nbsp;this website
                </span>
            </div>

            <div className="action openFilteringLog">
                <span className="act-icon">
                    <img
                        src="../../../assets/images/sandwich.svg"
                        className="icon-sandwich"
                        alt=""
                    />
                </span>
                <span
                    className="act-name"
                    i18n="popup_open_filtering_log"
                    role="button"
                    tabIndex="0"
                >
Open the filtering log
                </span>
            </div>

            <div className="action openAbuse">
                <span className="act-icon">
                    <img
                        src="../../../assets/images/thumb-down.svg"
                        className="icon-thumb-down"
                        alt=""
                    />
                </span>
                <span className="act-name" i18n="popup_abuse_site" role="button" tabIndex="0">Report&nbsp;this website</span>
            </div>

            <div className="action siteReport">
                <span className="act-icon">
                    <img src="../../../assets/images/icon-cross.svg" className="icon-cross" alt="" />
                </span>
                <span
                    className="act-name"
                    i18n="popup_security_report"
                    role="button"
                    tabIndex="0"
                >
                Reset all custom rules for this page
                </span>
            </div>
        </div>
    </div>
);

export default Options;
