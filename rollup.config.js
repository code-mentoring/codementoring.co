import commonjs from 'rollup-plugin-commonjs';
import node from 'rollup-plugin-node-resolve';
import typescript2 from 'rollup-plugin-typescript2';
import minify from 'rollup-plugin-babel-minify';
import multi from 'rollup-plugin-multi-entry';

const plugins = [
    multi(),
    commonjs(),
    node(),
    typescript2(),
    minify()
];

const file = (name, out) => ({
    input: `./src/scripts/${name}.ts`,
    output: {
        file: `./public/scripts/${out || name}.js`,
        format: 'cjs'
    },
    plugins
})

export default [
    file('index'),
];


