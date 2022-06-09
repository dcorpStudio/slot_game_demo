import * as _G from '../../system/all_modules';
const { $ } = _G;

import { _ } from './utils_common'; // special case for sub-modules
export default {
    isVecHorz(vec: cc.Vec2) {
        return _.abs(vec.x) > _.abs(vec.y);
    },

    getPointRanges(pointArr) {
        const BIG_INT = 99999999; // Number.MAX_SAFE_INTEGER;
        let minX = BIG_INT, minY = BIG_INT, maxX = -BIG_INT, maxY = -BIG_INT;
        pointArr.map(p => {
            minX = _.min(minX, p.x);
            minY = _.min(minY, p.y);
            maxX = _.max(maxX, p.x);
            maxY = _.max(maxY, p.y);
        });
        // _.log(` minX = ${minX}, minY = ${minY}, maxX = ${maxX}, maxY = ${maxY} `);
        return { minX, minY, maxX, maxY };
    },


    distance2polygon(p, pointArr) {
        function distToSegment({ x, y }, { x: x1, y: y1 }, { x: x2, y: y2 }) {
            var A = x - x1;
            var B = y - y1;
            var C = x2 - x1;
            var D = y2 - y1;

            var dot = A * C + B * D;
            var len_sq = C * C + D * D;
            var param = -1;
            if (len_sq != 0) { param = dot / len_sq; }

            var xx, yy;
            if (param < 0) {
                xx = x1;
                yy = y1;
            } else if (param > 1) {
                xx = x2;
                yy = y2;
            } else {
                xx = x1 + param * C;
                yy = y1 + param * D;
            }

            var dx = x - xx;
            var dy = y - yy;
            return Math.sqrt(dx * dx + dy * dy);
        }

        const dArr = pointArr.map(
            (subPoint, i) => {
                const nextSubPoint = pointArr[i + 1] || pointArr[0];
                const distance = distToSegment(p, subPoint, nextSubPoint);
                return distance;
            }
        ).sort(
            (A, B) => A > B ? 1 : -1
        );
        const ret = dArr[0];
        return ret;
    },
}

