const tmp = require('tmp-promise');

const { 
    Splitter, 
    Merger, 
    FileInputStream, 
    FileOutputStream 
} = require('exmes');

async function run() {
  const dir = await tmp.dir({ unsafeCleanup: true });
  console.log('Using temporary directory:', dir.path);

  try {
    const comparator = (x, y) => Number(x) - Number(y);
    
    const inputStream = new FileInputStream('numbers.txt', ' ');
    const splitter = new Splitter({
      maxGroupSize: 1000,
      groupOutputStreamCreator: index => new FileOutputStream(`${dir.path}/group-${index}`, ' '),
      comparator
    });
    const sortedGroupsInputStreams = await splitter.splitAndOutputSortedGroups(inputStream);

    const outputStream = new FileOutputStream('sorted-numbers.txt', ' ');
    const merger = new Merger(comparator);
    await merger.merge(sortedGroupsInputStreams, outputStream);
  } catch (err) {
    console.error('Error occured while sorting', err);
  } finally {
    dir.cleanup();
    console.log('Temporary directory deleted');
  }
}

run();






