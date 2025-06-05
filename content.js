(function () {
    'use strict';


    const CONFIG = {
        DEPRECATED_VERSIONS: ['1.', '2.', '3.', '4.', '5.', '6.', '7.', '8.', '9.',
            '10.', '11.', '12.', '13.', '14.'],
        DETECTION_DELAY: 1000,
        COLORS: {
            DEPRECATED: '#ff0000',
            NORMAL: '#000000'
        }
    };

    /**
 * Checks if the given Angular version is deprecated
 * @param {string} version - The Angular version to check
 * @returns {boolean} True if the version is deprecated
 */
    function isVersionDeprecated(version) {
        return CONFIG.DEPRECATED_VERSIONS.some(depVersion => version.startsWith(depVersion));
    }

    function detectAngular() {
        let angularVersion = null;
        let isAngular = false;

        // Check for Angular (2+)
        if (window.ng && window.ng.version && window.ng.version.full) {
            angularVersion = window.ng.version.full;
            isAngular = true;
        }

        // Check for AngularJS (1.x)
        else if (window.angular && window.angular.version) {
            angularVersion = window.angular.version.full;
            isAngular = true;
        }
        // Check for Angular elements in DOM
        else if (document.querySelector('[ng-app], [data-ng-app], ng-app') ||
            document.querySelector('*[ng-version]')) {
            isAngular = true;
            // Try to get version from ng-version attribute
            const ngVersionElement = document.querySelector('*[ng-version]');
            if (ngVersionElement) {
                angularVersion = ngVersionElement.getAttribute('ng-version');
            }
        }
        // Additional check for script tags
        else {
            const scripts = Array.from(document.scripts);
            for (let script of scripts) {
                if (script.src && (
                    script.src.includes('angular') ||
                    script.src.includes('@angular') ||
                    script.src.includes('ng-')
                )) {
                    isAngular = true;
                    break;
                }
            }
        }

        return { isAngular, version: angularVersion };
    }

    function createVersionDisplay(version) {
        try {
            const existing = document.getElementById('angular-version-detector');
            if (existing) {
                existing.remove();
            }

            const host = document.createElement('div');
            const shadowRoot = host.attachShadow({
                mode: 'open',
                delegatesFocus: true
            });

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = chrome.runtime.getURL('styles.css')

            const container = document.createElement('div');
            container.id = 'angular-version-detector';
            container.className = 'angular-detector-container';

            // Close button
            const closeBtn = document.createElement('div');
            closeBtn.setAttribute('title', 'Close');
            closeBtn.setAttribute('role', 'button');
            closeBtn.className = 'angular-detector-close';
            closeBtn.innerHTML = '×';
            closeBtn.onclick = () => {
                closeBtn.onclick = null;
                host.remove();
            };

            // Angular logo SVG
            const logo = document.createElement('div');
            logo.innerHTML = `<svg viewBox="-8 0 272 272"version="1.1"xmlns="http://www.w3.org/2000/svg"xmlns:xlink="http://www.w3.org/1999/xlink"preserveAspectRatio="xMidYMid"><g><path d="M0.0996108949,45.522179 L125.908171,0.697276265 L255.103502,44.7252918 L234.185214,211.175097 L125.908171,271.140856 L19.3245136,211.971984 L0.0996108949,45.522179 Z"fill="#E23237"></path><path d="M255.103502,44.7252918 L125.908171,0.697276265 L125.908171,271.140856 L234.185214,211.274708 L255.103502,44.7252918 L255.103502,44.7252918 Z"fill="#B52E31"></path><path d="M126.107393,32.27393 L126.107393,32.27393 L47.7136187,206.692607 L76.9992218,206.194553 L92.7377432,166.848249 L126.207004,166.848249 L126.306615,166.848249 L163.063035,166.848249 L180.29572,206.692607 L208.286381,207.190661 L126.107393,32.27393 L126.107393,32.27393 Z M126.306615,88.155642 L152.803113,143.5393 L127.402335,143.5393 L126.107393,143.5393 L102.997665,143.5393 L126.306615,88.155642 L126.306615,88.155642 Z"fill="#FFFFFF"></path></g></svg>`;

            const versionText = document.createElement('div');
            versionText.className = 'angular-version-text';

            if (version) {
                const isDeprecated = isVersionDeprecated(version);
                versionText.style.color = isDeprecated ? CONFIG.COLORS.DEPRECATED : CONFIG.COLORS.NORMAL;
                versionText.textContent = version;

                if (isDeprecated) {
                    const deprecatedLabel = document.createElement('div');
                    deprecatedLabel.className = 'deprecated-label';
                    deprecatedLabel.textContent = '(deprecated version)';
                    deprecatedLabel.style.color = CONFIG.COLORS.DEPRECATED;
                    container.appendChild(deprecatedLabel);
                }
            } else {
                versionText.textContent = 'Detected';
                versionText.style.color = CONFIG.COLORS.NORMAL;
            }
            container.appendChild(logo);
            container.appendChild(versionText);

            //document.body.appendChild(container);
            container.appendChild(closeBtn);
            shadowRoot.appendChild(link);
            shadowRoot.appendChild(container);
            document.body.appendChild(host);
            window.isAngularDetectorActive = true;
        } catch (error) {
            console.warn('Angular Detector: Failed to create display', error);
        }
    }

    function init() {
        if (window.isAngularDetectorActive) {
            return;
        }

        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init, { once: true });
        } else {
            // Small delay to ensure Angular has initialized
            setTimeout(() => {
                const result = detectAngular();
                if (result.isAngular) {
                    createVersionDisplay(result.version);
                }
            }, CONFIG.DETECTION_DELAY);
        }
    }
    init();
})();