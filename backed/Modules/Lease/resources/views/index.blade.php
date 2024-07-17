@extends('lease::layouts.master')

@section('content')
    <h1>Hello World</h1>

    <p>Module: {!! config('lease.name') !!}</p>
@endsection
