
import {test} from '../../../util/test.js';
import {createMap} from '../../../util/index.js';
import ScaleControl from '../../../../src/ui/control/scale_control.js';

test('ScaleControl appears in bottom-left by default', (t) => {
    const map = createMap(t);
    map.addControl(new ScaleControl());
    map._domRenderTaskQueue.run();

    t.equal(map.getContainer().querySelectorAll('.mapboxgl-ctrl-bottom-left .mapboxgl-ctrl-scale').length, 1);
    t.end();
});

test('ScaleControl appears in the position specified by the position option', (t) => {
    const map = createMap(t);
    map.addControl(new ScaleControl(), 'top-left');
    map._domRenderTaskQueue.run();

    t.equal(map.getContainer().querySelectorAll('.mapboxgl-ctrl-top-left .mapboxgl-ctrl-scale').length, 1);
    t.end();
});

test('ScaleControl should change unit of distance after calling setUnit', (t) => {
    const map = createMap(t);
    const scale = new ScaleControl();
    const selector = '.mapboxgl-ctrl-bottom-left .mapboxgl-ctrl-scale';
    map.addControl(scale);
    map._domRenderTaskQueue.run();

    let contents = map.getContainer().querySelector(selector).innerHTML;
    t.match(contents, /km/);

    scale.setUnit('imperial');
    map._domRenderTaskQueue.run();
    contents = map.getContainer().querySelector(selector).innerHTML;
    t.match(contents, /mi/);
    t.end();
});

test('ScaleControl should respect the maxWidth regardless of the unit and actual scale', (t) => {
    const map = createMap(t);
    const maxWidth = 100;
    const scale = new ScaleControl({maxWidth, unit: 'nautical'});
    const selector = '.mapboxgl-ctrl-bottom-left .mapboxgl-ctrl-scale';
    map.addControl(scale);
    map.setZoom(12.5);
    map._domRenderTaskQueue.run();

    const el = map.getContainer().querySelector(selector);
    t.ok(parseFloat(el.style.width, 10) <= maxWidth, 'ScaleControl respects maxWidth');
    t.end();
});

test('ScaleControl should support different projections', (t) => {
    const map = createMap(t, {
        center: [-180, 0]
    });

    const scale = new ScaleControl();
    const selector = '.mapboxgl-ctrl-bottom-left .mapboxgl-ctrl-scale';
    map.addControl(scale);
    map.setZoom(12.5);

    map._domRenderTaskQueue.run();
    let contents = map.getContainer().querySelector(selector).innerHTML;
    t.notMatch(contents, /NaN|undefined/);

    const projections = [
        'albers',
        'equalEarth',
        'equirectangular',
        'lambertConformalConic',
        'mercator',
        'globe',
        'naturalEarth',
        'winkelTripel',
    ];

    for (const projection of projections) {
        map.setProjection(projection);
        map._domRenderTaskQueue.run();
        contents = map.getContainer().querySelector(selector).innerHTML;
        t.notMatch(contents, /NaN|undefined/, `ScaleControl supports ${projection}`);
    }

    t.end();
});
