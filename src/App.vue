<script setup lang="ts">
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import prettyMs from 'pretty-ms'
import { ref, computed, onMounted } from 'vue'

dayjs.extend(utc)
dayjs.extend(timezone)

// Weeks are starting from monday
// https://github.com/iamkun/dayjs/issues/215#issuecomment-471280396
dayjs.Ls.en.weekStart = 1

const isChinese = navigator.language.includes('zh')

const label = isChinese
  ? `距进击的巨人下一集更新还有:`
  : `The Next Episide of AOT Will Air In:`

const tip = isChinese
  ? `根据中文字幕发布时间预估`
  : `Based on the release time of English Sub`

const now = ref(dayjs().tz('Asia/Shanghai'))

const prettyTime = computed(() => {
  const timeInThisWeek = now.value.startOf('week').add(2, 'hour')
  let remaining = ref(0)
  if (now.value.isBefore(timeInThisWeek)) {
    remaining.value = now.value.diff(timeInThisWeek)
  } else {
    const timeInNextWeek = now.value
      .add(7, 'day')
      .startOf('week')
      .add(2, 'hour')
    remaining.value = timeInNextWeek.diff(now.value)
  }
  return prettyMs(remaining.value, {
    secondsDecimalDigits: 0,
  })
})

onMounted(() => {
  setInterval(() => {
    now.value = dayjs().tz('Asia/Shanghai')
  }, 1000)
})
</script>

<template>
  <div class="text-center flex items-center h-screen justify-center">
    <div class="-mt-10">
      <h1 class="text-2xl">{{ label }}</h1>
      <div class="mt-4 text-7xl font-bold">{{ prettyTime }}</div>
      <div
        class="text-gray-300 mt-5 flex space-x-1 justify-center items-center text-xs"
      >
        <span
          ><svg
            class="w-3 h-3"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            ></path></svg></span
        ><span>{{ tip }}</span>
      </div>
    </div>
  </div>
</template>
