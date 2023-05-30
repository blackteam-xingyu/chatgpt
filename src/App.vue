<script setup lang="ts">
import { EnumPlacement } from '@/engine/Enum';
import { Refresh, Delete, Promotion } from '@element-plus/icons-vue';
import ChatGpt from '@/assets/chatgpt.svg';
import { ElMessage } from 'element-plus';
import type { AxiosResponse } from 'axios';
import moment from 'moment';
interface Chat {
  role: 'chatgpt' | 'user';
  content: string;
}
const chatList = ref<Chat[]>([]);
chatList.value = [
  {
    role: 'chatgpt',
    content:
      '欢迎使用ChatGpt 4，由于接口不是SSE协议订阅，我将生成完整答案后才会展示出来。所以，如果没报错还请耐心等待。\n由于训练语料的原因，当你问我是什么版本的GPT时，我可能回答为GPT-3。实际上，我使用的是GPT-4引擎。',
  },
];
const inputMsg = ref('');
const disable = ref(false);
interface SendRecord {
  text: string;
}
interface GetRecord {
  text: string;
  fileId: string;
}
let inputFileId: string | null = null;
const Send = async () => {
  try {
    const startTime = moment();
    disable.value = true;
    const length = chatList.value.length;
    chatList.value.push({
      role: 'user',
      content: inputMsg.value,
    });
    chatList.value.push({
      role: 'chatgpt',
      content: '...',
    });
    const {
      data: {
        code,
        data: { text, fileId },
      },
    } = await Axios.post<SendRecord, AxiosResponse<{ code: number; data: GetRecord; message: string }>>(
      '/chat-api/send',
      {
        text: inputMsg.value,
        inputFileId,
      },
    );
    console.log(code);
    if (code === 0) {
      chatList.value[length + 1].content = text + `(此次回答用时:${moment().diff(startTime) / 1000}s)`;
      inputFileId = fileId;
      inputMsg.value = '';
    } else {
      ElMessage.error('接口异常');
    }
  } catch (error) {
    console.error(error);
    ElMessage.error('接口异常');
  } finally {
    disable.value = false;
  }
};
const DeleteList = () => {
  chatList.value = [
    {
      role: 'chatgpt',
      content:
        '欢迎使用ChatGpt 4，由于接口不是SSE协议订阅，我将生成完整答案后才会展示出来。所以，如果没报错还请耐心等待。\n由于训练语料的原因，当你问我是什么版本的GPT时，我可能回答为GPT-3。实际上，我使用的是GPT-4引擎。',
    },
  ];
  inputFileId = null;
};
</script>

<template>
  <div class="app">
    <div class="headerboard">ChatGPT 4</div>
    <div class="msgboard">
      <div
        class="msgboard-item"
        :style="item.role === 'user' ? 'justify-content: flex-end;' : ''"
        v-for="(item, index) in chatList"
      >
        <ElAvatar v-show="item.role === 'chatgpt'" style="margin: 20px 20px 0 0" :src="ChatGpt" />
        <PopoverWarpper
          class="msgboard-item-popver"
          :key="index"
          :placement="item.role === 'user' ? EnumPlacement.RightStart : EnumPlacement.LeftStart"
        >
          <div v-if="item.role === 'user'" style="word-wrap: break-word">{{ item.content }}</div>
          <v-md-preview v-else :text="item.content" :key="item.content"></v-md-preview>
        </PopoverWarpper>
        <ElAvatar
          v-show="item.role === 'user'"
          style="margin: 20px 0 0 20px"
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        />
      </div>
      <div id="msg_end" style="height: 0px; overflow: hidden"></div>
    </div>
    <div class="chatboard">
      <ElLink :disabled="disable" :underline="false" title="刷新token"><Refresh class="chatboard-icon" /></ElLink>
      <ElLink :disabled="disable" :underline="false" title="清除会话" @click="DeleteList">
        <Delete class="chatboard-icon" />
      </ElLink>
      <ElInput :disabled="disable" v-model="inputMsg" placeholder="请输入您的提问"></ElInput>
      <ElLink :disabled="disable" :underline="false" @click="Send()" title="发送">
        <Promotion class="chatboard-icon" />
      </ElLink>
    </div>
  </div>
</template>

<style lang="scss">
@import url('@/assets/main.scss');
.app {
  height: 100%;
  .headerboard {
    height: 60px;
    background-color: #180e7294;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
    font-weight: 600;
    color: #fff;
    text-shadow: 1px 1px 1px #000;
  }
  .msgboard {
    height: calc(100% - 120px);
    width: 100%;
    padding: 0 3%;
    overflow: auto;
    &-item {
      width: 100%;
      display: flex;
      &-popver {
        max-width: 70%;
        text-align: left;
      }
    }
  }
  .chatboard {
    height: 60px;
    display: flex;
    padding: 0 2%;
    align-items: center;
    &-icon {
      font-size: 18px;
      margin: 0 5px;
      color: #fff;
    }
  }
}
</style>
