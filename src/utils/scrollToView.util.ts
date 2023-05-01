const scrollSmoothTo = (position?: number, scrollContainerElement?: HTMLElement, element?: HTMLElement, offsetY = 0): Promise<boolean> => {
    return new Promise((resolve, reject) => {

        let _scrollContainerElement = scrollContainerElement || window;
        let _position = position || 0;

        if (scrollContainerElement && element) {
            const containerBoundTop = scrollContainerElement.getBoundingClientRect().top;
            const elementBoundTop = element.getBoundingClientRect().top - containerBoundTop;
            _position = elementBoundTop - offsetY;
        }

        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = (callback) => {
                return setTimeout(callback, 17);
            };
        }
        // 当前滚动高度
        let scrollTop = 0;

        if (scrollContainerElement) {
            scrollTop = (_scrollContainerElement as HTMLElement)?.scrollTop
        } else {
            scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        }

        // 滚动step方法
        const step = () => {
            // 距离目标滚动距离
            var distance = _position - scrollTop;
            // 目标滚动位置
            scrollTop = scrollTop + distance / 5;
            if (Math.abs(distance) < 1) {
                _scrollContainerElement!.scrollTo(0, _position);
                resolve(true);
            } else {
                _scrollContainerElement!.scrollTo(0, scrollTop);
                requestAnimationFrame(step);
            }
        };
        step();
    })

};

export {scrollSmoothTo}
