
/*
// Token di accesso per l'API di Notion
const TOKEN = 'secret_T9oy68TJxm4F27FHeMeRaeJCGbpYzGateJ7cgJtEgQC';

// ID del database di origine
const SOURCE_DATABASE_ID = 'b04115769c5c4984baec923b222745f1';

// https://www.notion.so/paradygma/b04115769c5c4984baec923b222745f1?v=0088d954022249489e6cb17fb174fdc8&pvs=4

// ID del database di destinazione
const DESTINATION_DATABASE_ID = '209fc9d9eba4404985ef9aff531a8b3f';

// https://www.notion.so/paradygma/209fc9d9eba4404985ef9aff531a8b3f?v=d450f176d09844b49f1ae44142b886e8&pvs=4




// link db di test creazione https://www.notion.so/paradygma/294093d1943041e3bceb9acfc7f293d5?v=0c04764aae8b4f5eb1583104ee5aa849&pvs=4

*/


const fetch = require('axios');
const { Client } = require('@notionhq/client');
const notion = new Client({ auth: 'secret_T9oy68TJxm4F27FHeMeRaeJCGbpYzGateJ7cgJtEgQC' });
let startingTimestamp = '';
let startingID = '';
let requestCount = 0;
const requestLimit = 3;
// const requestInterval = 1000;  Tempo in millisecondi (1000ms = 1 secondo)
let lastRequestTime = Date.now();
const maxRequestsPerSecond = 3;
const requestInterval = 1000 / maxRequestsPerSecond; 


async function fetchDataAndCreatePage() {
  try {
    const currentTime = Date.now();
    const timeSinceLastRequest = currentTime - lastRequestTime;

    if (timeSinceLastRequest < requestInterval) {
      const waitTime = requestInterval - timeSinceLastRequest;
      console.log(`Attendi ${waitTime}ms prima di effettuare la prossima richiesta.`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

/*    if (requestCount >= requestLimit) {
      console.warn('Hai raggiunto il limite massimo di richieste. Attendi prima di eseguirne altre.');
      return; // Esce dalla funzione senza eseguire ulteriori richieste
    }
*/
    
    const databaseId = 'b04115769c5c4984baec923b222745f1';
    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          property: 'Last edited time',
          direction: 'descending',
        },
      ],
      page_size: 4,
    });
    const results = response.results;
    lastRequestTime = Date.now();
    requestCount++;
    console.log(requestCount);



    
    // console.log(results);
    let lastTimestamp = results[0].last_edited_time;
    let lastID = results[0].id;
    
    if (lastTimestamp !== startingTimestamp && lastID !== startingID) {
      startingTimestamp = lastTimestamp;
      const titleItem = results[0].properties.Name.title[0].plain_text;
      console.log('funzione ok per item ' + titleItem )
      const response = await notion.pages.create({
        "parent": {
          "type": "database_id",
          "database_id": "209fc9d9eba4404985ef9aff531a8b3f"
        },
        "properties": {
          "Name": {
            "title": [
              {
                "text": {
                  "content": titleItem
                }
              }
            ]
          },
        },
      });
      // requestCount++;
      lastRequestTime = Date.now();
    } else {
      console.log('niente di nuovo')
    }

    requestCount++;

    
    // setInterval(fetchDataAndCreatePage, requestInterval);

      } catch (error) {
        console.error("Errore durante la query del database:", error.message);
      }
        finally {
          // Imposta nuovamente l'intervallo di polling
          setTimeout(fetchDataAndCreatePage, requestInterval);
          console.log('conteggio richieste ' + requestCount);
          console.log('intervallo tra le richieste ' + requestInterval);
        }
      }
  // setInterval(fetchDataAndCreatePage, requestInterval);

      fetchDataAndCreatePage();

    

    
      /* for (const result of results) {
        const responseTitle = await notion.pages.retrieve({ page_id: result.id });
        const title = responseTitle.properties.Name.title[0].plain_text;
        const response = await notion.pages.create({
          "parent": {
            "type": "database_id",
            "database_id": "294093d1943041e3bceb9acfc7f293d5"
          },
          "properties": {
            "Name": {
              "title": [
                {
                  "text": {
                    "content": title
                  }
                }
              ]
            },
          },
        });
      }
      startingTimestamp = results.length; 
    // } else {
    //   console.log("Non ci sono nuovi item nel database sorgente. Nessuna nuova pagina verrà creata nel database destinazione.");
    // }
    */
/*  } catch (error) {
    console.error("Errore durante la query del database:", error.message);
  } 
}

fetchDataAndCreatePage(); */

/* const fetch = require('axios');
const { Client } = require('@notionhq/client');
const notion = new Client({ auth: 'secret_T9oy68TJxm4F27FHeMeRaeJCGbpYzGateJ7cgJtEgQC' });

async function fetchDataAndCreatePage() {
  try {
    const sourceDatabaseId = 'b04115769c5c4984baec923b222745f1';
    const destinationDatabaseId = '294093d1943041e3bceb9acfc7f293d5';
    

    const sourceResponse = await notion.databases.query({
      database_id: sourceDatabaseId,
      sorts: [
        {
          property: 'Last edited time',
          direction: 'descending',
        },
      ],
    });
    const sourceResults = sourceResponse.results;

    const destinationResponse = await notion.databases.query({
      database_id: destinationDatabaseId,
    });
    const destinationResults = destinationResponse.results;

    for (const sourceResult of sourceResults) {
      const sourcePage = await notion.pages.retrieve({ page_id: sourceResult.id });
      const sourceTitle = sourcePage.properties.Name.title[0].plain_text;

      const isDuplicate = destinationResults.some(destinationResult => {
        const destinationPage = notion.pages.retrieve({ page_id: destinationResult.id });
        const destinationTitle = destinationPage.properties.Name.title[0].plain_text;

        return sourceTitle === destinationTitle;
      });

      if (!isDuplicate) {
        const response = await notion.pages.create({
          "parent": {
            "type": "database_id",
            "database_id": destinationDatabaseId
          },
          "properties": {
            "Name": {
              "title": [
                {
                  "text": {
                    "content": sourceTitle
                  }
                }
              ]
            },
          },
        });
      }
    }

  } catch (error) {
    console.error("Errore durante la query del database:", error.message);
  }
}

fetchDataAndCreatePage();







// Creazione pagina in database Tasks

/*
(async () => {
  const response = await notion.pages.create({
    "parent": {
        "type": "database_id",
        "database_id": "209fc9d9eba4404985ef9aff531a8b3f"
    },
    "properties": {
        "Name": {
            "title": [
                {
                    "text": {
                        "content": "Tuscan kale"
                    }
                }
            ]
        },
        "Description": {
            "rich_text": [
                {
                    "text": {
                        "content": "A dark green leafy vegetable"
                    }
                }
            ]
        },
        "Food group": {
            "select": {
                "name": "🥬 Vegetable"
            }
        }
    },
    "children": [
        {
            "object": "block",
            "heading_2": {
                "rich_text": [
                    {
                        "text": {
                            "content": "Lacinato kale"
                        }
                    }
                ]
            }
        },
        {
            "object": "block",
            "paragraph": {
                "rich_text": [
                    {
                        "text": {
                            "content": "Lacinato kale is a variety of kale with a long tradition in Italian cuisine, especially that of Tuscany. It is also known as Tuscan kale, Italian kale, dinosaur kale, kale, flat back kale, palm tree kale, or black Tuscan palm.",
                            "link": {
                                "url": "https://en.wikipedia.org/wiki/Lacinato_kale"
                            }
                        },
                        "href": "https://en.wikipedia.org/wiki/Lacinato_kale"
                    }
                ],
                "color": "default"
            }
        }
    ]
});
  console.log(response);
})();
*/