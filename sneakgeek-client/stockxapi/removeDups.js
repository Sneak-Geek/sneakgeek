db.shoes.aggregate([
  { "$group": {
      "_id": { "title": "$title" },
      "dups": { "$push": "$_id" },
      "count": { "$sum": 1 }
  }},
  { "$match": { "count": { "$gt": 1 } }}
]).forEach(function(doc) {
  doc.dups.shift();
  db.shoes.remove({ "_id": {"$in": doc.dups }});
});