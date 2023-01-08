---
title: 给多层组件添加v-model双向绑定
date: 2023/01/07
categories:
 - [经验集]
tags:
 - 经验集
description: "多层组件的v-model绑定"
---

组件绑定的详细方法在vue官方文档有详细介绍不多说

https://cn.vuejs.org/guide/components/events.html#usage-with-v-model

下面主要针对多层组件

需求：目前已实现一个CodeEditor具备双向绑定能力，能够使用v-model绑定编辑器中文本内容，但现在需要基于此再实现一层封装，如何让该组件也具备v-model能力？

```typescript
<template>
  <CodeEditor v-model="textInput" />
</template>

<script lang="ts" setup>
// 首先定义props和emit，这点和vue官方操作一致
defineProps<{
    modelValue: string
  }>(),
const emit = defineEmits(['update:modelValue'])
// 这里传入props里的数据，输送给CodeEditor
const textInput = ref(props.modelValue)
// 监听CodeEditor数据变化手动触发上层更新
watch(
  () => textInput.value,
  () => {
    emit('update:modelValue', textInput.value)
  },
)
</script>
```

相当于通过`textInput`进行了一个中转，实现一个双向绑定
