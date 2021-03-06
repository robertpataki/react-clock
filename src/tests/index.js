import React from 'react';
import { shallow, mount } from 'enzyme';
import expect from 'expect';

import Clock from '../index';

const { describe, it, beforeEach } = global;

describe('Clock', () => {
  it('renders without blowing up', () => {
    const wrapper = shallow(<Clock />);
    expect(wrapper).toExist();
  });

  it('has a default `theme` prop', () => {
    const wrapper = shallow(<Clock />);
    const expected = Clock.DEFAULT_THEME;
    const actual = wrapper.state().theme;
    expect(actual).toBe(expected);
  });

  it('has a default `diameter` prop', () => {
    const wrapper = mount(<Clock />);
    const expected = 'number';
    const actual = typeof wrapper.props().diameter;
    expect(actual).toBe(expected);
  });

  it('uses the `diameter` prop to draw the correct size SVG', () => {
    const wrapper = mount(<Clock diameter="100" />);
    const svgEl = wrapper.find({ width: '100', height: '100', viewBox: '0 0 100 100' });
    expect(svgEl.type()).toEqual('svg');

    expect(wrapper.html().toString().indexOf('width: 100px;') > 0).toBe(true);
    expect(wrapper.html().toString().indexOf('height: 100px;') > 0).toBe(true);
  });

  describe('with `time` prop', () => {
    it('doesn\'t tick', () => {
      const wrapper = mount(<Clock time="12:30" />);
      const expected = Clock.STATUSES.stopped;
      const actual = wrapper.state().status;
      expect(actual).toEqual(expected);
    });

    it('keeps the time prop unchanged', (done) => {
      const wrapper = mount(<Clock time="12:30" />);

      setTimeout(() => {
        const expected = { h: 12, m: 30, s: 0 };
        const actual = wrapper.state().time;
        expect(actual).toEqual(expected);
        done();
      }, 1100);
    });
  });

  describe('without `time` prop', () => {
    it('ticks', () => {
      const wrapper = mount(<Clock />);
      const expected = Clock.STATUSES.ticking;
      const actual = wrapper.state().status;
      expect(actual).toEqual(expected);
    });

    it('updates the time automatically', (done) => {
      const wrapper = mount(<Clock />);
      const firstTime = wrapper.state().time;

      setTimeout(() => {
        const expected = firstTime;
        const actual = wrapper.state().time;
        expect(actual.s).toEqual(expected.s + 1);
        done();
      }, 1100);
    });
  });

  describe('getCurrentTimeString()', () => {
    it('returns a : delimeted string with the current time\'s h, m, s values', () => {
      const now = new Date();
      const expected = [now.getHours(), now.getMinutes(), now.getSeconds()].join(':');
      const actual = Clock.getCurrentTimeString();
      expect(actual).toEqual(expected);
    });
  });

  describe('convertTimeStringToHash()', () => {
    it('converts a `h:m:s` formatted string to {h, m, s} formatted object', () => {
      const expected = { h: 16, m: 12, s: 10 };
      const actual = Clock.convertTimeStringToHash('16:12:10');
      expect(actual).toEqual(expected);
    });
  });

  describe('getPointByDegree()', () => {
    let radius;
    let centerX;
    let centerY;

    beforeEach(() => {
      radius = 100;
      centerX = centerY = radius;
    });

    it('returns the correct x/y positions for 3 o\'clock ', () => {
      let actual = Clock.getPointByDegree(90, radius, centerX, centerY);
      actual = { x: Math.round(actual.x), y: Math.round(actual.y) };
      const expected = { x: 200, y: 100 };
      expect(actual).toEqual(expected);
    });

    it('returns the correct x/y positions for 6 o\'clock ', () => {
      let actual = Clock.getPointByDegree(180, radius, centerX, centerY);
      actual = { x: Math.round(actual.x), y: Math.round(actual.y) };
      const expected = { x: 100, y: 200 };
      expect(actual).toEqual(expected);
    });

    it('returns the correct x/y positions for 9 o\'clock ', () => {
      let actual = Clock.getPointByDegree(270, radius, centerX, centerY);
      actual = { x: Math.round(actual.x), y: Math.round(actual.y) };
      const expected = { x: 0, y: 100 };
      expect(actual).toEqual(expected);
    });

    it('returns the correct x/y positions for 12 o\'clock ', () => {
      let actual = Clock.getPointByDegree(360, radius, centerX, centerY);
      actual = { x: Math.round(actual.x), y: Math.round(actual.y) };
      const expected = { x: 100, y: 0 };
      expect(actual).toEqual(expected);
    });
  });

  describe('configureTheme()', () => {
    describe('when no theme ID is provided', () => {
      it('returns the default theme when provided ID can\'t be found', () => {
        const expected = Clock.DEFAULT_THEME;
        const actual = Clock.configureTheme();
        expect(actual).toEqual(expected);
      });
    });

    describe('when a theme ID is provided', () => {
      describe('and the theme ID is a string', () => {
        it('returns the theme matching the provided ID', () => {
          const expected = Clock.THEMES.light;
          const actual = Clock.configureTheme('light');
          expect(actual).toEqual(expected);
        });

        it('returns the default theme when provided ID can\'t be found', () => {
          const expected = Clock.DEFAULT_THEME;
          const actual = Clock.configureTheme('foo.bar');
          expect(actual).toEqual(expected);
        });
      });

      describe('and the theme ID is an object', () => {
        it('returns the default theme object extended with the passed in object', () => {
          const expected = {
            ...Clock.DEFAULT_THEME,
            bezel: 'red',
          };
          const actual = Clock.configureTheme({ bezel: 'red' });
          expect(actual).toEqual(expected);
        });
      });
    });
  });
});
