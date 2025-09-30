#!/bin/sh

. .env

download() {
  key=$1
  case "$key" in
    proposals)
      name="Proposal"
      file="app/data/proposals.json"
      ;;
    profiles)
      name="Profile"
      file="app/data/profiles.json"
      ;;
    workshops)
      name="Workshop"
      file="app/data/workshops.json"
      ;;
    timeschedule)
      name="Timeschedule"
      file="app/data/timeschedule.json"
      ;;
    *)
      echo "Unknown argument: $key"
      echo "Usage: $0 [proposals|profiles|workshops|timeschedule]"
      exit 1
      ;;
  esac

  echo "Downloading $name..."
  wget "${BASE_URL}?name=${name}" -O "$file"
}

if [ -n "$1" ]; then
  download "$1"
else
  for key in proposals profiles workshops timeschedule; do
    download "$key"
  done
fi

npx tsx scripts/schedule.ts
