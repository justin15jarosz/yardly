#!/bin/sh
# wait-for.sh

set -e

host="$1"
shift
port="$1"
shift
cmd="$@"

echo "Waiting for $host:$port to be available..."

while ! nc -z "$host" "$port"; do
  sleep 1
done

echo "$host:$port is available. Starting app..."

exec $cmd
