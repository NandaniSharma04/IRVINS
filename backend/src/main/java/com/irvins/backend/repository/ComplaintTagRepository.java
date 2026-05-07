// package com.irvins.backend.repository;

// import com.irvins.backend.entity.ComplaintTag;
// import org.springframework.data.jpa.repository.JpaRepository;

// import java.util.Optional;

// public interface ComplaintTagRepository extends JpaRepository<ComplaintTag, Long> {

//     Optional<ComplaintTag> findBySourceComplaintIdAndTargetComplaintId(
//         Long sourceId, Long targetId
//     );
//     List<ComplaintTag> findBySourceComplaintIdOrTargetComplaintId(
//     Long sourceId, Long targetId
// );
// }
package com.irvins.backend.repository;

import com.irvins.backend.entity.ComplaintTag;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ComplaintTagRepository extends JpaRepository<ComplaintTag, Long> {

    Optional<ComplaintTag> findBySourceComplaintIdAndTargetComplaintId(
        Long sourceId, Long targetId
    );

    // ADD THIS LINE: This tells Spring to find tags where the ID is either the source or the target
    List<ComplaintTag> findBySourceComplaintIdOrTargetComplaintId(
        Long sourceId, Long targetId
    );
}