<template>
  <div class="view login" v-if="state.username === '' || state.username === null">

    <form class="login-form" @submit.prevent="Login">
      <div class="form-inner">
        <h1>Chat with Mekari Qontak</h1>
        <label for="username">Username</label>
        <input type="text" v-model="inputUsername" placeholder="Please enter your username..." />
        <input type="submit" value="Login" />
      </div>
    </form>
  </div>

  <div class="view chat" v-else>
    <header>
      <button class="logout" @click="Logout">Logout</button>
      <h1>Welcome, {{ state.username }}</h1>
    </header>

    <section class="chat-box">
      <div v-for="message in state.messages" :key="message.key" :class="message.username == state.username
        ? 'message current-user'
        : 'message'
        ">
        <div class="flex justify-start mb-4" v-if="message.type == 0">
          <div class="msg_cotainer">
            <div style="position: static;" class="font-bold capitalize">{{ message.username }}
              <span class="font-weight-light ml-2" style="font-size: 10px;">{{ datetime }}</span>
            </div>
            <div class="mb-3" style="font-size: 13px;" v-html="message.content"></div>
          </div>
        </div>
        <div class="d-flex justify-end mb-4" v-else>
          <div class="msg_cotainer_send">
            <div style="position: static;" class="font-bold capitalize">{{ message.username }}
            </div>
            <div class="mb-3" style="font-size: 13px;" v-html="message.content"></div>
          </div>
        </div>
      </div>
    </section>

    <footer>
      <form @submit.prevent="SendMessage">
        <input type="text" v-model="inputMessage" placeholder="Write a message..." />
        <!-- <input ref="upload" type="file" class="hidden" @change="(event) => onFileChanged(event)">
        <button type="button" @click="$refs.upload.click()">file</button> -->
        <input type="submit" value="Send" />
      </form>
    </footer>
  </div>
</template>

<script>
import { reactive, onMounted, ref } from 'vue';
import { database, storage } from './lib/firebase';
// import uploadStorage from './lib/upload-storage';
import { getDatabase, ref as firebaseRef, set as firebaseSet, push as firebasePush, onValue } from "firebase/database";


export default {
  setup() {
    const inputUsername = ref('');
    const inputMessage = ref('');

    const state = reactive({
      username: '',
      messages: [],
    });

    // function file upload
    // async function onFileChanged(e) {
    //   console.log("event", e.target.files[0])

    //   const imgUrl = await uploadStorage(e.target.files[0])

    //   console.log(imgUrl);
    // }

    // login to indetify user
    const Login = () => {
      if (inputUsername.value != '' || inputUsername.value != null) {
        state.username = inputUsername.value;
        inputUsername.value = '';
      }
    };

    // write data in database messages
    const writeMessageData = (username, type, content) => {
      const db = getDatabase();
      firebasePush(firebaseRef(db, 'messages'), {
        username,
        type,
        content
      })
    }

    const Logout = () => {
      state.username = '';
    };

    // send message user
    const SendMessage = () => {

      if (inputMessage.value === '' || inputMessage.value === null) {
        return;
      }


      // send message from user
      writeMessageData(state.username, 1, inputMessage.value)

      // if either admin user name, admin will be send text auto replay
      if (state.username !== "admin") {
        const greetings = [
          "hai",
          "hello",
          "helo",
          "halo",
          "hallo",
          "selamat",
          "pagi",
          "siang",
          "sore",
          "malam",
        ]

        // send message from admin when is include greetings 
        for (let i = 0; i < greetings.length; i++) {
          const greet = greetings[i];
          let content = inputMessage.value.toLowerCase()
          if (content.includes(greet)) {
            writeMessageData("admin", 0, "Terimakasih telah menghubungi kami, ada yang bisa kami bantu atas permasalahannya? jika tidak ada akan kami tutup chat ini.");
            break;
          }
        }
      }

      // clear input message
      inputMessage.value = '';
    };

    // read all message in room
    const readMessageDataList = () => {
      const db = getDatabase();

      onValue(firebaseRef(db, 'messages'), (snapshot) => {
        const data = snapshot.val();
        let messages = [];

        Object.keys(data).forEach((key) => {
          messages.push({
            id: key,
            type: data[key].type,
            username: data[key].username,
            content: data[key].content,
          });
        });

        state.messages = messages;

      })
    }

    onMounted(() => {
      readMessageDataList()
    });

    return {
      inputUsername,
      Login,
      state,
      inputMessage,
      SendMessage,
      // onFileChanged,
      Logout,
    };
  },
};
</script>

<style scoped>
* {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.view {
  display: flex;
  justify-content: center;
  min-height: 100vh;
  background-color: #009998;
}

.view.login {
  align-items: center;
  width: 400px;
}

.view.login .login-form {
  display: block;
  width: 100%;
  padding: 15px;
}

.view.login .login-form .form-inner {
  display: block;
  background-color: #fff;
  padding: 50px 15px;
  border-radius: 16px;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
}

.view.login .login-form .form-inner h1 {
  color: #aaa;
  font-size: 28px;
  margin-bottom: 30px;
}

.view.login .login-form .form-inner label {
  display: block;
  margin-bottom: 5px;
  color: #aaa;
  font-size: 16px;
  transition: 0.4s;
}

.view.login .login-form .form-inner input[type='text'] {
  appearance: none;
  border: none;
  outline: none;
  background: none;
  display: block;
  width: 100%;
  padding: 10px 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  color: #333;
  font-size: 18px;
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
  background-color: #f3f3f3;
  transition: 0.4s;
}

.view.login .login-form .form-inner input[type='text']::placeholder {
  color: #888;
  transition: 0.4s;
}

.view.login .login-form .form-inner input[type='submit'] {
  appearance: none;
  border: none;
  outline: none;
  background: none;
  display: block;
  width: 100%;
  padding: 10px 15px;
  background-color: #009998;
  border-radius: 8px;
  color: #fff;
  font-size: 18px;
  font-weight: 700;
}

.view.login .login-form .form-inner:focus-within label {
  color: #009998;
}

.view.login .login-form .form-inner:focus-within input[type='text'] {
  background-color: #fff;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
}

.view.login .login-form .form-inner:focus-within input[type='text']::placeholder {
  color: #666;
}

.view.chat {
  flex-direction: column;
}

.view.chat header {
  position: relative;
  display: block;
  width: 100%;
  padding: 50px 30px 10px;
}

.view.chat header .logout {
  position: absolute;
  top: 15px;
  right: 15px;
  appearance: none;
  border: none;
  outline: none;
  background: none;
  color: #fff;
  font-size: 18px;
  margin-bottom: 10px;
  text-align: right;
}

.view.chat header h1 {
  color: #fff;
}

.view.chat .chat-box {
  border-radius: 24px 24px 0px 0px;
  background-color: #fff;
  box-shadow: 0px 0px 12px rgba(100, 100, 100, 0.2);
  flex: 1 1 100%;
  padding: 30px;
}

.view.chat .chat-box .message {
  display: flex;
  margin-bottom: 15px;
}

.view.chat .chat-box .message .message-inner .username {
  color: #888;
  font-size: 16px;
  margin-bottom: 5px;
  /* padding-left: 15px; */
  padding-right: 15px;
  justify-content: flex-start;
  text-align: left;

}

.view.chat .chat-box .message .message-inner .content {
  display: inline-block;
  padding: 10px 20px;
  background-color: #f3f3f3;
  border-radius: 999px;
  color: #333;
  font-size: 18px;
  line-height: 1.2em;
  text-align: left;
}

.view.chat .chat-box .message.current-user {
  margin-top: 30px;
  justify-content: flex-end;
  text-align: right;
}

.view.chat .chat-box .message.current-user .message-inner {
  max-width: 75%;
}

.view.chat .chat-box .message.current-user .message-inner .content {
  color: #fff;
  font-weight: 600;
  background-color: #009998;
}

.view.chat footer {
  position: sticky;
  bottom: 0px;
  background-color: #fff;
  padding: 30px;
  box-shadow: 0px 0px 12px rgba(100, 100, 100, 0.2);
}

.view.chat footer form {
  display: flex;
}

.view.chat footer form input[type='text'] {
  flex: 1 1 100%;
  appearance: none;
  border: none;
  outline: none;
  background: none;
  display: block;
  width: 100%;
  padding: 10px 15px;
  border-radius: 8px 0px 0px 8px;
  color: #333;
  font-size: 18px;
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
  background-color: #f3f3f3;
  transition: 0.4s;
}

.view.chat footer form input[type='text']::placeholder {
  color: #888;
  transition: 0.4s;
}

.view.chat footer form input[type='submit'] {
  appearance: none;
  border: none;
  outline: none;
  background: none;
  display: block;
  padding: 10px 15px;
  border-radius: 0px 8px 8px 0px;
  background-color: #009998;
  color: #fff;
  font-size: 18px;
  font-weight: 700;
}


.msg_cotainer {
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 10px;
  font-size: 12px;
  max-width: 300px;
  border-radius: 0 10px 0 10px;
  background-color: #E5E9F2;
  padding: 10px;
  position: relative;
  text-align: left;
}

.msg_cotainer_send {
  margin-top: auto;
  margin-bottom: auto;
  margin-right: 10px;
  font-size: 12px;
  max-width: 300px;
  border-radius: 10px 0 10px 0;
  background-color: #FDF7B2;
  padding: 10px;
  position: relative;
}
</style>
