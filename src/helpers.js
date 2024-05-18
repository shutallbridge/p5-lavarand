// eslint-disable-next-line no-unused-vars
function safeCommit(commit) {
  push();
  commit();
  pop();
}
