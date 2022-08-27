import { describe, expect, it } from '../../tests/mrjs.js';
import { Router } from './router.js';

const tell = (str) => (props) => ({str,props});
const baseroutes = {
    'test':tell('test'),
    'test/add/:id':tell('test/add/:id'),
    'test/:id/add':tell('test/:id/add'),
    'test/:id/edit':tell('test/:id/edit'),
    'test/:id/:sub':tell('test/:id/:sub'),
    'test/add':tell('test/add'),
    'test/:id':tell('test/:id'),
};
const subroutes = {
    'subpath':tell('subpath'),
    'subpath/:id':tell('subpath/:id'),
};

describe('Route Init',()=>{
    it("Initialize Router",()=>{
        expect(Router).toBeTruthy();
    });
});

describe('Make Base Routes',()=>{
    it("Don't match if route empty",()=>{
        location.hash = "";
        let route = Router.make(baseroutes,tell('default'))();
        console.log(route)

        expect(route.str).toBe('default');
        expect(Object.keys(route.props).length).toBe(0);
    });
    it("Match test route",()=>{
        location.hash = "#test";
        let route = Router.make(baseroutes,tell('default'))();
        
        expect(route.str).toBe('test');
        expect(Object.keys(route.props).length).toBe(0);
    });
    it("Match test/add route",()=>{
        location.hash = "#test/add";
        let route = Router.make(baseroutes,tell('default'))();

        expect(route.str).toBe('test/add');
        expect(Object.keys(route.props).length).toBe(0);
    });
    it("Match test/:id route",()=>{
        location.hash = "#test/4";
        let route = Router.make(baseroutes,tell('default'))();

        expect(route.str).toBe('test/:id');
        expect(Object.keys(route.props).length).toBe(1);
        expect(route.props.id).toBe('4');
    });
    it("Match test/:id/:sub route",()=>{
        location.hash = "#test/gronkle/stein";
        let route = Router.make(baseroutes,tell('default'))();

        expect(route.str).toBe('test/:id/:sub');
        expect(Object.keys(route.props).length).toBe(2);
        expect(route.props.id).toBe('gronkle');
        expect(route.props.sub).toBe('stein');
    });
});