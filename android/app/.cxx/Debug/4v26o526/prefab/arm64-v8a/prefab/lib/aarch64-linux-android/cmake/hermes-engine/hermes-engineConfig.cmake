if(NOT TARGET hermes-engine::hermesvm)
add_library(hermes-engine::hermesvm SHARED IMPORTED)
set_target_properties(hermes-engine::hermesvm PROPERTIES
    IMPORTED_LOCATION "/Users/pavankarthik/.gradle/caches/8.13/transforms/c07f82ccf2b9b5dd1e5d91cd65a8af73/transformed/hermes-android-250829098.0.9-debug/prefab/modules/hermesvm/libs/android.arm64-v8a/libhermesvm.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/pavankarthik/.gradle/caches/8.13/transforms/c07f82ccf2b9b5dd1e5d91cd65a8af73/transformed/hermes-android-250829098.0.9-debug/prefab/modules/hermesvm/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

