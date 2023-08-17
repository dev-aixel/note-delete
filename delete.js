const fetch = require('node-fetch');

const customUserId = "";

const token = "";
const instance = "russkey.sda2.net";

(async () => {
    try {
        let userId = customUserId;

        // カスタムで指定されてない場合(Null)の場合はトークンから取得
        if (!userId) {
            const meResponse = await fetch(`https://${instance}/api/i`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ i: token })
            });
            const meResult = await meResponse.json();
            userId = meResult.id;
        }

        const notesResponse = await fetch(`https://${instance}/api/users/notes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: userId, limit: 100 })
        });
        const notesResult = await notesResponse.json();

        let i = 0;
        while (i < notesResult.length) {
            const noteId = notesResult[i].id;
            const deleteResponse = await fetch(`https://${instance}/api/notes/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ i: token, noteId: noteId })
            });

            await new Promise(resolve => setTimeout(resolve, 1000)); // Sleep for 1 second

            if (deleteResponse.status === 204) {
                console.log(`削除成功: ${noteId}`);
            } else {
                const errorJson = await deleteResponse.json();
                console.log(`失敗: ${deleteResponse.status}\n${JSON.stringify(errorJson)}`);
            }

            i++;
        }
    } catch (error) {
        console.error(error);
    }
})();
// Creator 風緑#3079 Modified by @dev_aixel