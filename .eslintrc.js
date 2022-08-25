module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/essential',
    'prettier' //把prettier中设置的规则添加进来，让它覆盖上面设置的规则。这样就不会和上面的规则冲突了，表示 eslint-plugin-prettier，需要放到最后以覆盖别的规则
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: ['vue', 'prettier'], // 表示 eslint-config-prettier
  rules: {
    //0关闭，1警告，2禁止
    'prettier/prettier': 'error', //使用prettier
    semi: [0, 'always'], //语句强制分号结尾
    quotes: [0, 'double'], //引号类型 ""
    'no-alert': 0, //禁止使用alert
    'no-console': 0, //禁止使用console
    'no-const-assign': 2, //禁止修改const声明的变量
    'no-debugger': 2, //禁止使用debugger
    'no-duplicate-case': 2, //switch中的case标签不能重复
    'no-extra-semi': 2, //禁止多余的冒号
    'no-multi-spaces': 1, //不能用多余的空格
    'no-unused-vars': 1, //不能出现未使用变量
    'vue/no-reserved-component-names': 0, //不允许在组件定义中使用保留名称
    'vue/multi-word-component-names': 0 //要求组件名称始终为多字
  }
}
